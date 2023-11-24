const modal = document.querySelector('.modal');
const modalInput = document.getElementById('modal-input');
const inputUUID = document.getElementById('UUID');
const btnUpdate = document.querySelector('update');
const btnCancel = document.getElementById('modal-cancel-btn');
const btnSave = document.getElementById('modal-save-btn');

function updateTask(elemento) {
	modal.style.display = 'block';

	const UUID = elemento.getAttribute('data-task-id');
	modalInput.value = document.getElementById(UUID).getElementsByTagName('div')[0].innerHTML;
	inputUUID.value = UUID;
}

btnSave.addEventListener('click', () => {
	document.getElementById(inputUUID.value).getElementsByTagName('div')[0].innerHTML =
		modalInput.value;
	modal.style.display = 'none';
});

btnCancel.addEventListener('click', () => {
	modal.style.display = 'none';
});
