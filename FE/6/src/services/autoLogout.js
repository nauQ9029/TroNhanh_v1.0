
let logoutTimer;
const TIMEOUT = 60 * 30 * 1000;

let externalLogout = null;

const resetTimer = () => {
  console.log('🕐 Reset timer do user activity');
  clearTimeout(logoutTimer);
 logoutTimer = setTimeout(() => {
  console.log("😴 Không hoạt động → auto logout");
  alert("Phiên đăng nhập đã hết hạn vì không hoạt động.");
  if (externalLogout) {
    externalLogout("idle timeout");
    window.location.href = "/login";
  }
}, TIMEOUT);


};

export const initAutoLogout = (onLogout) => {
  externalLogout = onLogout;
  ['click', 'mousemove', 'keydown', 'scroll'].forEach((event) => {
    window.addEventListener(event, resetTimer);
  });
  resetTimer();
};

export const stopAutoLogout = () => {
  ['click', 'mousemove', 'keydown', 'scroll'].forEach((event) => {
    window.removeEventListener(event, resetTimer);
  });
  clearTimeout(logoutTimer);
  externalLogout = null;
};