import { Modal, Tag, Space } from "antd";
import dayjs from "dayjs";

const statusColors = {
  pending: "orange",
  approved: "green",
  reported: "red",
  deleted: "default",
};

const PostDetailModal = ({ post, onClose }) => (
  <Modal
    open={!!post}
    onCancel={onClose}
    footer={null}
    title={post ? post.title : ""}
    width={650}
  >
    {post && (
      <div>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <b>Owner:</b> {post.owner}
          </div>
          <div>
            <b>Status:</b>{" "}
            <Tag color={statusColors[post.status]}>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </Tag>
          </div>
          <div>
            <b>Date Posted:</b> {dayjs(post.datePosted).format("YYYY-MM-DD")}
          </div>
          {post.status === "reported" && (
            <div>
              <b>Reported:</b> {post.reported} time(s)
              {post.reported > 5 && (
                <Tag color="red" style={{ marginLeft: 8 }}>
                  Priority
                </Tag>
              )}
              <div style={{ marginTop: 8 }}>
                <b>Report Reasons:</b>
                <ul style={{ margin: "8px 0 0 20px" }}>
                  {post.reportReasons && post.reportReasons.length > 0 ? (
                    post.reportReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))
                  ) : (
                    <li>No reason provided</li>
                  )}
                </ul>
              </div>
            </div>
          )}
          <div>
            <b>Description:</b> (Demo) This is a placeholder for post details, images, price, location, etc.
          </div>
        </Space>
      </div>
    )}
  </Modal>
);

export default PostDetailModal;