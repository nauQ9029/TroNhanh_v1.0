import React, { useState, useEffect, useCallback } from "react";
import { Modal, Tag, Space, Image, Spin, message } from "antd";
import { UserOutlined, EnvironmentOutlined, DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getAccommodationDetailAdmin } from "../../../services/accommodationAdminService";

const statusColors = {
  pending: "blue",
  approved: "green",
  reported: "red",
  deleted: "volcano",
  rejected: "magenta",
};

const PostDetailModal = ({ post, onClose }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDetailData = useCallback(async () => {
    if (!post || !post._id) return;

    setLoading(true);
    try {
      const data = await getAccommodationDetailAdmin(post._id);
      setDetailData(data);
    } catch (error) {
      message.error("Failed to fetch accommodation details");
      console.error("Error fetching detail:", error);
    } finally {
      setLoading(false);
    }
  }, [post]);

  useEffect(() => {
    fetchDetailData();
  }, [fetchDetailData]);

  return (
    <Modal
      open={!!post}
      onCancel={onClose}
      footer={null}
      title={post ? post.title : ""}
      width={800}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : (
        detailData && (
          <div>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
                {/* Basic Information */}
                <div style={{ flex: 1 }}>
                  <h4>Basic Information</h4>
                  <div>
                    <b>Title:</b> {detailData.title}
                  </div>
                  <div>
                    <b>Owner:</b> <UserOutlined /> {detailData.ownerId?.name || "N/A"}
                    {detailData.ownerId?.email && ` (${detailData.ownerId.email})`}
                  </div>
                  <div>
                    <b>Status:</b>{" "}
                    <Tag color={statusColors[detailData.approvedStatus || detailData.status]}>
                      {(detailData.approvedStatus || detailData.status || "unknown").charAt(0).toUpperCase() +
                        (detailData.approvedStatus || detailData.status || "unknown").slice(1)}
                    </Tag>
                  </div>
                  <div>
                    <b>Date Posted:</b> {dayjs(detailData.createdAt).format("YYYY-MM-DD HH:mm")}
                  </div>
                  {detailData.approvedAt && (
                    <div>
                      <b>Approved At:</b> {dayjs(detailData.approvedAt).format("YYYY-MM-DD HH:mm")}
                    </div>
                  )}
                  {detailData.rejectedReason && (
                    <div>
                      <b>Rejected Reason:</b> {detailData.rejectedReason}
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div style={{ flex: 1 }}>
                  <h4>Property Details</h4>
                  <div>
                    <b>Price:</b> <DollarOutlined /> {detailData.price ? `$${detailData.price}` : "N/A"}
                  </div>
                  <div>
                    <b>Location:</b> <EnvironmentOutlined /> {
                      detailData.location ?
                        (typeof detailData.location === 'object' ?
                          `${detailData.location.street || ''}, ${detailData.location.district || ''}`.trim().replace(/^,\s*|,\s*$/g, '') :
                          detailData.location
                        ) :
                        "N/A"
                    }
                  </div>
                  {detailData.description && (
                    <div>
                      <b>Description:</b>
                      <div style={{ marginTop: 8, padding: 10, background: "#f5f5f5", borderRadius: 4 }}>
                        {detailData.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Photos */}
              {detailData && (
                <>
                  <div>
                    <h4>Photos ({detailData.photos?.length || 0})</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {detailData.photos && detailData.photos.length > 0 ? (
                        detailData.photos.map((photo, index) => (
                          <Image
                            key={index}
                            width={120}
                            height={120}
                            src={`http://localhost:5000${photo}`}
                            style={{ objectFit: "cover", borderRadius: 4 }}
                            placeholder={
                              <div style={{
                                width: 120,
                                height: 120,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f0f0f0"
                              }}>
                                Loading...
                              </div>
                            }
                          />
                        ))
                      ) : (
                        <Image
                          width={120}
                          height={120}
                          src="/image/default-image.jpg"
                          style={{ objectFit: "cover", borderRadius: 4 }}
                          placeholder={
                            <div style={{
                              width: 120,
                              height: 120,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#f0f0f0"
                            }}>
                              No Image
                            </div>
                          }
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Additional Information */}
              <div>
                <h4>Additional Information</h4>
                <div>
                  <b>Is Approved:</b> {detailData.isApproved ? "Yes" : "No"}
                </div>
                <div>
                  <b>Created:</b> {dayjs(detailData.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </div>
                <div>
                  <b>Last Updated:</b> {dayjs(detailData.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
            </Space>
          </div>
        )
      )}
    </Modal>
  );
};

export default PostDetailModal;