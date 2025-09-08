import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const PostDeleteModal = ({ open, onCancel, onOk }) => (
  <Modal
    open={open}
    onCancel={onCancel}
    onOk={onOk}
    okText="Delete"
    okButtonProps={{ danger: true }}
    cancelText="Cancel"
    title={
      <span>
        <ExclamationCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />
        Confirm Delete
      </span>
    }
  >
    <p>
      Are you sure you want to delete this post? This action will move the post to <b>Deleted</b> status.
    </p>
  </Modal>
);

export default PostDeleteModal;