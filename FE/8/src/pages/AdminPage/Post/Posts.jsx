import React, { useState, useEffect } from "react";
import { message } from "antd";
import PostFilterBar from "./PostFilterBar";
import PostTable from "./PostTable";
import PostDetailModal from "./PostDetailModal";
import PostDeleteModal from "./PostDeleteModal";
// import dayjs from "dayjs";
import { getAdminAccommodations, approveAccommodationAdmin, deleteAccommodationAdmin } from "../../../services/accommodationAdminService";

const Posts = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({
    owner: undefined,
    status: undefined,
    dateRange: [],
    search: "",
  });
  const [viewPost, setViewPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch accommodations from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: 1,
          limit: 20,
          owner: filters.owner,
          status: filters.approvedStatus,
          fromDate: filters.dateRange?.[0]?.format?.("YYYY-MM-DD"),
          toDate: filters.dateRange?.[1]?.format?.("YYYY-MM-DD"),
          search: filters.search,
        };
        const data = await getAdminAccommodations(params);
        setPosts(data.accommodations || []);
        
      } catch (err) {
        messageApi.open({
          type: 'error',
          content: 'Không thể tải dữ liệu. Vui lòng thử lại!',
          duration: 4,
        });
        console.error('Error fetching accommodations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, messageApi]);

  // Refresh data helper function
  const refreshData = async () => {
    const params = {
      page: 1,
      limit: 20,
      owner: filters.owner,
      status: filters.approvedStatus,
      fromDate: filters.dateRange?.[0]?.format?.("YYYY-MM-DD"),
      toDate: filters.dateRange?.[1]?.format?.("YYYY-MM-DD"),
      search: filters.search,
    };
    const data = await getAdminAccommodations(params);
    setPosts(data.accommodations || []);
  };

  // Handle approve post
  const handleApprove = async (postId, approvedStatus) => {
    // Hiển thị loading message
    const loadingKey = 'approve-loading';
    messageApi.open({
      key: loadingKey,
      type: 'loading',
      content: 'Đang xử lý phê duyệt...',
      duration: 0,
    });

    try {
      await approveAccommodationAdmin(postId, approvedStatus);
      
      // Ẩn loading và hiển thị success
      messageApi.open({
        key: loadingKey,
        type: 'success',
        content: 'Browser login successful!',
        duration: 3,
      });
      
      // Refresh data
      await refreshData();
    } catch (err) {
      // Ẩn loading và hiển thị error
      messageApi.open({
        key: loadingKey,
        type: 'error',
        content: 'Post could not be approved. Please try again!',
        duration: 4,
      });
      console.error('Error approving post:', err);
    }
  };

  // Handle reject post with reason
  const handleReject = async (postId, approvedStatus, rejectedReason) => {
    // Hiển thị loading message
    const loadingKey = 'reject-loading';
    messageApi.open({
      key: loadingKey,
      type: 'loading',
      content: 'Processing rejection...',
      duration: 0,
    });

    try {
      await approveAccommodationAdmin(postId, approvedStatus, rejectedReason);
      
      // Ẩn loading và hiển thị warning
      messageApi.open({
        key: loadingKey,
        type: 'warning',
        content: `Post rejected${rejectedReason ? `: ${rejectedReason}` : ''}`,
        duration: 4,
      });
      
      // Refresh data
      await refreshData();
    } catch (err) {
      // Ẩn loading và hiển thị error
      messageApi.open({
        key: loadingKey,
        type: 'error',
        content: 'Post could not be rejected. Please try again!',
        duration: 4,
      })
      console.error('Error rejecting post:', err);
    }
  };

  // Handle delete post with reason
  const handleDelete = async (postId, reason) => {
    // Hiển thị loading message
    const loadingKey = 'delete-loading';
    messageApi.open({
      key: loadingKey,
      type: 'loading',
      content: 'Processing deletion...',
      duration: 0,
    });

    try {
      await deleteAccommodationAdmin(postId, reason);
      
      // Ẩn loading và hiển thị success (dùng error type để nhấn mạnh tính nghiêm trọng)
      messageApi.open({
        key: loadingKey,
        type: 'error',
        content: `Post deleted successfully! Reason: ${reason}`,
        duration: 4,
      });
      
      // Refresh data
      await refreshData();
    } catch (err) {
      // Ẩn loading và hiển thị error
      messageApi.open({
        key: loadingKey,
        type: 'error',
        content: 'Post could not be deleted. Please try again!',
        duration: 4,
      });
      console.error('Error deleting post:', err);
    }
  };

  // Only show: name, owner, createdAt in the table
  const tableData = posts.map((post) => ({
    id: post._id,
    title: post.title,
    owner: post.owner?.name || "N/A",
    status: post.approvedStatus || post.status || "unknown",
    createdAt: post.createdAt,
    raw: post, // for detail modal
  }));

  return (
    <>
      {contextHolder}
      <div className="page-container" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 24 }}>Posts Management</h1>
        <PostFilterBar filters={filters} setFilters={setFilters} ownerOptions={[]} />
        <PostTable
          data={tableData}
          loading={loading}
          onView={(row) => setViewPost(row.raw)}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          // Add other handlers as needed
        />
        <PostDetailModal post={viewPost} onClose={() => setViewPost(null)} />
        <PostDeleteModal open={!!deletePost} onCancel={() => setDeletePost(null)} onOk={() => {}} />
      </div>
    </>
  );
};

export default Posts;