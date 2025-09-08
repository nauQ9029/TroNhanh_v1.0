import React, { useState } from "react";
import { message } from "antd";
import PostFilterBar from "./PostFilterBar";
import PostTable from "./PostTable";
import PostDetailModal from "./PostDetailModal";
import PostDeleteModal from "./PostDeleteModal";
import dayjs from "dayjs";

// Demo data with report reasons
const demoPosts = [
  {
    id: 1,
    title: "Spacious Apartment in District 1",
    owner: "Nguyen Van A",
    status: "approved",
    datePosted: "2025-06-10",
    reported: 0,
    reportReasons: [],
  },
  {
    id: 2,
    title: "Nice House with Garden",
    owner: "Tran Thi B",
    status: "reported",
    datePosted: "2025-06-09",
    reported: 6,
    reportReasons: [
      "Spam content",
      "Misleading information",
      "Offensive language",
      "Duplicate post",
      "Scam suspicion",
      "Fake images",
    ],
  },
  {
    id: 3,
    title: "Studio for Rent",
    owner: "Le Van C",
    status: "pending",
    datePosted: "2025-06-08",
    reported: 0,
    reportReasons: [],
  },
  {
    id: 4,
    title: "Cheap Room in District 5",
    owner: "Pham Thi D",
    status: "deleted",
    datePosted: "2025-06-07",
    reported: 2,
    reportReasons: ["Spam content", "Inappropriate images"],
  },
];

const Posts = () => {
  const [posts, setPosts] = useState(demoPosts);
  const [filters, setFilters] = useState({
    owner: undefined,
    status: undefined,
    dateRange: [],
    search: "",
  });
  const [viewPost, setViewPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [history, setHistory] = useState({});

  // Update status handler
  const handleStatusChange = (postId, newStatus, reason) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          setHistory(h => ({ ...h, [postId]: p.status }));
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
    message.success(`Post status updated to "${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}"`);
  };

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    const matchOwner = filters.owner ? post.owner === filters.owner : true;
    const matchStatus = filters.status ? post.status === filters.status : true;
    const matchDate =
      filters.dateRange.length === 2
        ? dayjs(post.datePosted).isAfter(filters.dateRange[0].startOf("day").subtract(1, "day")) &&
        dayjs(post.datePosted).isBefore(filters.dateRange[1].endOf("day").add(1, "day"))
        : true;
    const matchSearch = filters.search
      ? post.title.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    return matchOwner && matchStatus && matchDate && matchSearch;
  });

  // Owner options for filter
  const ownerOptions = [...new Set(posts.map((p) => p.owner))];

  // Delete post handler (soft delete)
  const handleDelete = () => {
    if (deletePost) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === deletePost.id ? { ...p, status: "deleted" } : p
        )
      );
      message.success("Post moved to Deleted status.");
      setDeletePost(null);
    }
  };

  const handleUndo = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId && history[postId]
          ? { ...p, status: history[postId] }
          : p
      )
    );
  };


  return (
    <div className="page-container" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 24 }}>Posts Management</h1>
      <PostFilterBar filters={filters} setFilters={setFilters} ownerOptions={ownerOptions} />
      <PostTable
        data={filteredPosts}
        onView={setViewPost}
        onApprove={(id) => handleStatusChange(id, "approved")}
        onDelete={setDeletePost}
        onDropdownAction={handleStatusChange}
        onUndo={handleUndo}
      />
      <PostDetailModal post={viewPost} onClose={() => setViewPost(null)} />
      <PostDeleteModal open={!!deletePost} onCancel={() => setDeletePost(null)} onOk={handleDelete} />
    </div>
  );
};

export default Posts;