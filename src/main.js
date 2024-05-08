import App from './App.svelte';

const app = new App({
	target: document.body,
});

// Asegúrate de que los service workers son soportados antes de intentar registrar uno
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js')
			.then(registration => {
				console.log('Service Worker registrado con éxito:', registration.scope);
			})
			.catch(err => {
				console.error('Registro de Service Worker fallido:', err);
			});
	});
}

export default app;
