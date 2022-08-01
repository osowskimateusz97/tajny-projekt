const appendModalText = (modal, id) => {
  const modalTitle = modal.querySelector(".modal__title");
  const modalContent = modal.querySelector(".modal__content");
  const { title, description } = getTextById(id);
  modalTitle.textContent = title;
  modalContent.innerHTML = description;
};

const handleOpenModal = (modal, triggerEl) => {
  const modalType = triggerEl.dataset.id;
  appendModalText(modal, modalType);
};

// Init micro modal

MicroModal.init({
  disableScroll: true,
  onShow: handleOpenModal,
});
