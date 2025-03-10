import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, message, onClose }) => {
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
    document.body // Portal의 대상 DOM
  );
};

export default Modal;
