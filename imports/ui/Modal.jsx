import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, message, onClose, target = document.body }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="text_body_m">{message}</div>
        <button onClick={onClose} className="btn-primary">
          확인
        </button>
      </div>
    </div>,
    target
  );
};

export default Modal;
