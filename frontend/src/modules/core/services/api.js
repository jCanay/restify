// const BASE_URL = "http://localhost:8080";
// const TOKEN =
//     "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc3MTcxNzE5MiwiZXhwIjoxNzcxODAzNTkyfQ.0M0hAr3DAKpQtHs4eA4qk1YLa-HU8-asiEK6aTk1UNas6cV-N-HNP8B8gqYA5laJrOnjaWuInD7TDeeoqJj9eA";

// export const getAdminDashboard = async () => {
//     const response = await fetch(`${BASE_URL}/admin/dashboard`, {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${TOKEN}`,
//         },
//     });
//     const data = await response.json();
//     return data;
// };

// export const sendLoginRequest = async (data) => {
//     const response = await fetch(`${BASE_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     });

//     if (response.status === 403) {
//         return "Usuario o email o contraseña incorrectos"
//     }

//     return response.text()
// };
