import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import "./styles/App.scss";
import successImage from "./assets/success-image.png";

function App() {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState(null);
	const [visibleUsers, setVisibleUsers] = useState(6);
	const [loading, setLoading] = useState(true);
	const [photo, setPhoto] = useState(null);
	const [token, setToken] = useState("");
	console.log("users>>", users);
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
		photo: "https://i.postimg.cc/qM6b1j85/image0.jpg",
	});

	function submit(e) {
		e.preventDefault();
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
					position: "",
					position_id: 1, // reset position_id field
					photo: "https://i.postimg.cc/qM6b1j85/image0.jpg",
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
			// } else if (id === "position") {
			// 	if (value.length < 2 || value.length > 60) {
			// 		return;
			// 	}
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
			<div className="wrapper">
				<Header />

				<main className="main">
					<h2>Working with GET request</h2>
					{loading ? (
						<p>Loading...</p>
					) : (
						<ul className="cards">
							{users.slice(0, visibleUsers).map((user) => (
								<li className="card" key={user.id}>
									<img
										className="card-img"
										src={user.photo}
										alt=""
									/>
									<p>{user.name}</p>
									<p>{user.position}</p>
									<p>{user.email}</p>
									<p>{user.phone}</p>
								</li>
							))}
							{users.length > visibleUsers && (
								<button
									onClick={() =>
										setVisibleUsers(visibleUsers + 6)
									}
								>
									Show more
								</button>
							)}
						</ul>
					)}

					<h2>Working with POST request</h2>

					<form onSubmit={(e) => submit(e)}>
						<input
							onChange={(e) => handle(e)}
							value={formData.name}
							type="text"
							placeholder="Your name"
							id="name"
							maxLength="60"
							required
							pattern=".{2,60}"
							title="Username should contain 2-60 characters"
						/>
						<input
							onChange={(e) => handle(e)}
							value={formData.email}
							type="email"
							placeholder="Email"
							id="email"
							required
						/>
						<input
							onChange={(e) => handle(e)}
							value={formData.phone}
							type="tel"
							placeholder="Phone"
							id="phone"
							required
							pattern="^\+?\d{10,}$"
							title="Please enter a valid phone number (at least 10 digits)"
						/>
						<input
							onChange={(e) => handle(e)}
							value={formData.position}
							type="text"
							placeholder="position"
							id="position"
							maxLength="60"
							required
							pattern=".{2,60}"
							title="position should contain 2-60 characters"
						/>

						<input
							type="file"
							accept="image/jpeg, image/jpg"
							onChange={(e) => handle(e)}
						/>
						{photo && <img src={photo} alt="uploaded photo" />}
						{photo && (
							<button onClick={() => setPhoto(null)}>
								Remove Photo
							</button>
						)}
						<button type="submit">Submit</button>
					</form>
					{successForm && (
						<div>
							<p>Success</p> <img src={successImage} />
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

export default App;