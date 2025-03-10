import React from "react";
import ReactDOM from "react-dom";

const ModalCancle = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="text_body-m">{message}</div>
        <div className="modal-buttons">
          <button onClick={onCancel} className="btn-secondary">
            취소
          </button>
          <button onClick={onConfirm} className="btn-primary">
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body // Portal의 대상 DOM
  );
};

export default ModalCancle;
