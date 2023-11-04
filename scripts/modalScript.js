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

const initModal = () => {
  // Init micro modal
  if (typeof MicroModal !== "undefined") {
    MicroModal.init({
      disableScroll: true,
      onShow: handleOpenModal,
      awaitCloseAnimation: true,
    });
  }
  const modalOverlay = document.querySelector(".modal__overlay");

  modalOverlay.addEventListener("mousedown", (e) => {
    if (e.target.closest(".modal__container")) return;
    if (typeof MicroModal !== "undefined") {
      MicroModal.close("modal-1");
    }
  });
};
