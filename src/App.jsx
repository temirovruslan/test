import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import "./styles/App.scss";
import successImage from "./assets/success-image.png";
import Button from "./components/Button";

const positions = [
	{ id: 1, name: "Frontend Developer" },
	{ id: 2, name: "Backend Developer" },
	{ id: 3, name: "Designer" },
	{ id: 4, name: "QA" },
];

function App() {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState(null);
	const [visibleUsers, setVisibleUsers] = useState(6);
	const [loading, setLoading] = useState(true);
	const [photo, setPhoto] = useState(null);
	const [token, setToken] = useState("");
	const [clicked, setClicked] = useState(false);
	const [sendingData, setSendingData] = useState(false);
	const [selectedPosition, setSelectedPosition] = useState(null);

	const handlePositionChange = (position) => {
		setSelectedPosition(position.id);
	};

	const handleClick = () => {
		if (sendingData) {
			setClicked(true);
		}
	};
	// console.log("users>>", users);
	//get data

	fetch("https://frontend-test-assignment-api.abz.agency/api/v1/token")
		.then((response) => response.json())
		.then((data) => {
			// console.log(data);
			setToken(data.token);
		})
		.catch((error) => console.error(error));

	async function getUsers() {
		setLoading(true);

		try {
			const response = await fetch(
				"https://frontend-test-assignment-api.abz.agency/api/v1/users?page=1&count=100"
			);
			const data = await response.json();

			if (data.success) {
				const sortedUsers = data.users.sort((a, b) => {
					const dateA = new Date(a.registration_timestamp);
					const dateB = new Date(b.registration_timestamp);

					if (dateA < dateB) return 1;
					if (dateA > dateB) return -1;
					return 0;
				});

				setUsers(sortedUsers);
			} else {
				setError("An error occurred while fetching the users.");
			}
		} catch (error) {
			console.error(error);
			setError("An error occurred while fetching the users.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getUsers();
	}, []);

	// post data

	const [successForm, setSuccessForm] = useState(false);
	const [formData, setFormData] = useState({
		id: "1",
		name: "",
		email: "",
		phone: "",
		position: "",
		position_id: 1, // add position_id field
		photo: "",
	});

	function submit(e) {
		e.preventDefault();
		setSendingData(true);
		// const selectedPhoto = e.target.files[0];
		fetch("https://frontend-test-assignment-api.abz.agency/api/v1/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Token: token,
			},
			body: JSON.stringify(formData),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setFormData({
					id: 1,
					name: "",
					email: "",
					phone: "",
					position: selectedPosition,
					position_id: 1, // reset position_id field
					photo: "",
				});
				setSuccessForm((prev) => !prev);
				console.log(formData);
				setInterval((e) => {
					setSuccessForm(false);
				}, 5000);
			})
			.catch((error) => console.error(error));
	}

	function handle(e) {
		const newdata = { ...formData };
		const { id, value } = e.target;

		if (id === "name") {
			if (value.length < 2 || value.length > 60) {
				return;
			}
		} else if (id === "email") {
			const emailRegex = new RegExp(
				"^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])$"
			);
			if (!emailRegex.test(value)) {
				return;
			}
		} else if (id === "phone") {
			const phoneRegex = new RegExp("^\\+{0,1}380([0-9]{9})$");
			if (!phoneRegex.test(value)) {
				return;
			}
		} else if (id === "photo") {
			const selectedPhoto = e.target.files[0];
			if (
				selectedPhoto.type === "image/jpeg" ||
				selectedPhoto.type === "image/jpg"
			) {
				if (selectedPhoto.size <= 5000000) {
					const reader = new FileReader();
					reader.readAsDataURL(selectedPhoto);
					reader.onloadend = () => {
						const image = new Image();
						image.src = reader.result;
						image.onload = () => {
							if (image.width >= 70 && image.height >= 70) {
								setPhoto(selectedPhoto);
							} else {
								alert("Minimum size of photo 70x70px.");
							}
						};
					};
				} else {
					alert("The photo size must not be greater than 5 Mb.");
				}
			} else {
				alert("The photo format must be jpeg/jpg type.");
			}
		}

		newdata[id] = value;
		setFormData(newdata);
	}
	return (
		<div className="home">
			<Header />
			<div className="wrapper">
				<div className="mainImg-wrapper">
					<div className="main_img-text">
						<div>
							<h2>Test assignment for front-end developer</h2>
							<p>
								What defines a good front-end developer is one
								that has skilled knowledge of HTML, CSS, JS with
								a vast understanding of User design thinking as
								they'll be building web interfaces with
								accessibility in mind. They should also be
								excited to learn, as the world of Front-End
								Development keeps evolving.
							</p>
							<Button value="Sign up" />
						</div>
					</div>
				</div>
				<main className="main">
					<h2 className="get-title">Working with GET request</h2>
					{loading ? (
						<p>Loading...</p>
					) : (
						<ul className="cards">
							{users.slice(0, visibleUsers).map((user) => (
								<li className="card" key={user.id}>
									<img
										className="card-img"
										src={user.photo}
										alt={`alt=${user.name}'s photo`}
									/>
									<p className="cards-name">{user.name}</p>
									<p className="cards-position">
										{user.position}
									</p>
									<p className="cards-email">{user.email}</p>
									<p className="cards-phone">{user.phone}</p>
								</li>
							))}
						</ul>
					)}
					{users.length > visibleUsers && (
						<div className="btn-wrapper">
							<Button
								className="show_more-btn"
								value="Show more"
								onClick={() =>
									setVisibleUsers(visibleUsers + 6)
								}
							></Button>
						</div>
					)}

					<h2 className="post-title">Working with POST request</h2>

					<form className="form" onSubmit={(e) => submit(e)}>
						<input
							className="input"
							onChange={(e) => handle(e)}
							value={formData.name}
							type="text"
							placeholder="Your name"
							id="name"
							maxLength="60"
							required
							pattern=".{2,60}"
							title="Username should contain 2-60 characters"
							aria-label="name"
							aria-describedby="name-help"
						/>

						<input
							className="input"
							onChange={(e) => handle(e)}
							value={formData.email}
							type="email"
							placeholder="Email"
							id="email"
							required
							aria-label="Email"
							aria-describedby="email-help"
						/>

						<input
							className="input lastInput"
							onChange={(e) => handle(e)}
							value={formData.phone}
							type="tel"
							placeholder="Phone"
							id="phone"
							required
							pattern="^\+?\d{10,}$"
							title="Please enter a valid phone number (at least 10 digits)"
							aria-label="Phone number"
							aria-describedby="phone-help"
						/>
						<label className="label-for-phone" htmlFor="phone">
							+38 (XXX) XXX - XX - XX
						</label>

						{/* <span className="phone-example">
							+38 (XXX) XXX - XX - XX
						</span> */}

						{/* <input
							className="input"
							onChange={(e) => handle(e)}
							value={formData.position}
							type="text"
							placeholder="Position"
							id="position"
							maxLength="60"
							required
							pattern=".{2,60}"
							title="Position should contain 2-60 characters"
						/> */}
						<div className="radio-btns">
							<p>Select your position</p>
							{positions.map((position) => (
								<label key={position.id}>
									<input
										type="radio"
										name="position"
										value={position.id}
										checked={
											selectedPosition === position.id
										}
										onChange={() =>
											handlePositionChange(position)
										}
									/>
									{position.name}
								</label>
							))}
						</div>

						<input
							className="input"
							type="file"
							accept="image/jpeg, image/jpg"
							onChange={(e) => handle(e)}
							id="photo-upload"
						/>

						{photo && <img src={photo} alt="uploaded photo" />}
						{photo && (
							<button onClick={() => setPhoto(null)}>
								Remove Photo
							</button>
						)}

						{/* <button type="submit">Submit</button> */}
						<Button
							onClick={handleClick}
							type="submit"
							value="Submit"
							className={`${clicked ? "yellow-bg" : "gray-bg"}`}
						></Button>
					</form>

					{successForm && (
						<div>
							<p>Success</p> <img src={successImage} alt='successImage' />
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

export default App;
