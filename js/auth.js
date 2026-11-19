/* Вхід в адмін-панель (клієнтський захист).
   ВАЖЛИВО: сайт статичний (GitHub Pages), тож це лише захист від випадкових відвідувачів, а не справжня безпека.
   Змінити пароль: у консолі браузера виконайте
     crypto.subtle.digest("SHA-256", new TextEncoder().encode("ВАШ_ПАРОЛЬ")).then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("")))
   і вставте результат у ADMIN_HASH. Пароль за замовчуванням: jolly2026 */
const ADMIN_HASH = "a5cbf7912b0f28b25ac3da50a5c8b6a6acc29aa2adb2dbd61f1cf5941f3a74e0";
const AUTH_KEY = "jolly_admin_ok";

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

(function () {
  const body = document.body;
  const unlock = () => body.classList.add("authed");
  try { if (sessionStorage.getItem(AUTH_KEY) === ADMIN_HASH) unlock(); } catch (e) { /* ignore */ }

  document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const err = document.getElementById("loginErr");
    try {
      const h = await sha256(document.getElementById("loginPass").value);
      if (h === ADMIN_HASH) {
        try { sessionStorage.setItem(AUTH_KEY, h); } catch (x) { /* ignore */ }
        unlock();
      } else {
        err.textContent = "Невірний пароль.";
      }
    } catch (x) {
      err.textContent = "Браузер не підтримує перевірку пароля (потрібен https).";
    }
  });

  const out = document.getElementById("logoutBtn");
  if (out) out.onclick = () => {
    try { sessionStorage.removeItem(AUTH_KEY); } catch (x) { /* ignore */ }
    location.reload();
  };
})();
