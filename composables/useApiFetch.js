export async function useApiFetch(
  url,
  lang = "uz",
  method = "GET",
  options = {}
) {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  const token = process.client ? localStorage.getItem("token") : null;

  const defaults = {
    method,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(method != "GET" && {
      body: JSON.stringify({
        ...options,
      }),
    }),
  };

  return fetch(baseURL + url + "?lang=" + lang, defaults)
    .then((res) => res.json())
    .then((data) => {
      if (data.status == 401) {
        window.location = "/login";
        console.log(data);
      }
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
}
