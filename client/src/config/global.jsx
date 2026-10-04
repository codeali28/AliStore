import { message } from "antd";

window.getRandomId = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

window.isValidEmail = email => /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(email)


window.toastify = (msg, type) => message[type](msg)