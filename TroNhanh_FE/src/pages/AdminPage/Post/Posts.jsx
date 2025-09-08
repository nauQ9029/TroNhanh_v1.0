import React, { useState, useEffect, useCallback } from "react";
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
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    owner: undefined,
    approvedStatus: undefined,
    dateRange: [],
    search: "",
  });
  const [viewPost, setViewPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch accommodations from API
  const fetchData = useCallback(async (customParams = {}) => {
    setLoading(true);
    try {
      const params = {
        page: customParams.page || 1,
        limit: customParams.limit || 10,
        ...customParams
      };

      // Only add filters if they have values
      if (filters.owner) {
        params.owner = filters.owner;
      }
      if (filters.approvedStatus) {
        params.approvedStatus = filters.approvedStatus;
      }
      if (filters.search?.trim()) {
        params.search = filters.search.trim();
      }
      if (filters.dateRange?.[0] && filters.dateRange?.[1]) {
        params.fromDate = filters.dateRange[0].format("YYYY-MM-DD");
        params.toDate = filters.dateRange[1].format("YYYY-MM-DD");
      }
      
      const data = await getAdminAccommodations(params);
      
      // Client-side filtering since backend doesn't support it yet
      let filteredPosts = data.accommodations || [];
      if (filters.approvedStatus) {
        filteredPosts = filteredPosts.filter(post => {
          const postStatus = post.approvedStatus || (post.isApproved ? 'approved' : 'pending');
          return postStatus === filters.approvedStatus;
        });
        console.log('🔍 After client-side filter:', filteredPosts.length, 'posts');
      }
      
      setPosts(filteredPosts);
      setPagination(prev => ({ 
        ...prev, 
        total: filters.approvedStatus ? filteredPosts.length : (data.total || 0),
        page: params.page,
        limit: params.limit,
        totalPages: filters.approvedStatus ? Math.ceil(filteredPosts.length / params.limit) : (data.totalPages || 0)
      }));
      
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
  }, [filters, messageApi]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset pagination when filters change
  useEffect(() => {
    if (filters.owner || filters.approvedStatus || filters.search || filters.dateRange?.length > 0) {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchData({ page: 1 });
    }
  }, [filters.owner, filters.approvedStatus, filters.search, filters.dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh data helper function
  const refreshData = async () => {
    await fetchData({ page: pagination.page, limit: pagination.limit });
  };

  // Handle pagination change
  const handleTableChange = (newPagination) => {
    const newPage = newPagination.current;
    const newLimit = newPagination.pageSize;
    setPagination(prev => ({ ...prev, page: newPage, limit: newLimit }));
    fetchData({ page: newPage, limit: newLimit });
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
    approvedStatus: post.approvedStatus || "unknown",
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
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} posts`,
          }}
          onChange={handleTableChange}
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