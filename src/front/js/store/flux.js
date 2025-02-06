const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			auth: false, 
			user: null,  
			errorMessage: '',
		},
		actions: {
			// login
			login: async (email, password) => {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const raw = JSON.stringify({
					"email": email,
					"password": password,
				});

				const requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow",
				};

				try {
					const response = await fetch("https://humble-space-enigma-pjjq5g77v4v63g75-3001.app.github.dev/api/login", requestOptions);
					const result = await response.json();

					if (response.status === 200) {
						// Si el inicio de sesión se realiza correctamente, almacenamos el token y actualizamos el estado de autenticación
						localStorage.setItem("token", result.access_token);
						setStore({ auth: true, errorMessage: '', user: null }); 
						return true;
					} else {
						setStore({ errorMessage: result.msg || "Error en el login" });
						return false;
					}
				} catch (error) {
					console.error(error);
					setStore({ errorMessage: "An unexpected error occurred. Please try again." });
					return false;
				}
			},

			// Método para recuperar la información del perfil.
			getProfile: async () => {
				let token = localStorage.getItem("token");
				if (!token) {
					console.log("No token found");
					return;
				}

				try {
					const response = await fetch("https://humble-space-enigma-pjjq5g77v4v63g75-3001.app.github.dev/api/profile", {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${token}`,
						},
					});
					const result = await response.json();

					if (response.ok) {
						console.log("Profile successfully loaded: ", result);
						setStore({ user: result, errorMessage: '' });
					} else {
						setStore({ errorMessage: result.msg || "Failed to retrieve profile information." });
					}
				} catch (error) {
					console.error(error);
					setStore({ errorMessage: "An error occurred while fetching the profile." });
				}
			},
             
			////crear un nuevo endpoint que se llame verificacion de token
			//la peticion en la funcion tokenVerify del front deberia actualizar un estado auth:
			tokenVerify: async () => {
				let token = localStorage.getItem("token");
				if (!token) {
					setStore({ auth: false });  // Without a token, authentication is not verified.
					return;
				}

				try {
					const response = await fetch("https://humble-space-enigma-pjjq5g77v4v63g75-3001.app.github.dev/api/profile", {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${token}`,
						},
					});

					if (response.status === 200) {
						setStore({ auth: true });
					} else {
						setStore({ auth: false });
					}
				} catch (error) {
					console.error("Token validation failed.", error);
					setStore({ auth: false });
				}
			},

			// "Log out" //borrar el token del localStorage
			logout: () => {
				localStorage.removeItem("token"); 
				setStore({ auth: false, user: null }); 
			},

			// obtiene un mensaje del backend desde "/api/hello", lo guarda en el estado global de Flux.js y maneja posibles errores.
			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/api/user");
					const data = await resp.text();
			
					setStore({ message: data });
			
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
				}
			},
			
			changeColor: (index, color) => {
				const store = getStore();
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});
				setStore({ demo: demo });
			},
		},
	};
};

export default getState;