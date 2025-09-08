import React from "react";
import { Table, Tag, Alert, Typography, Button, Space } from "antd";
import { EyeOutlined, CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

const statusColors = {
  pending: "blue",
  approved: "green",
  rejected: "red",
};

const statusLabels = {  
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",

};

const ReportsTable = ({ 
  data, 
  loading, 
  pagination, 
  onChange,
  onView,
  onResolve
}) => {
  const columns = [
    { 
      title: "ID", 
      dataIndex: "_id", 
      key: "_id", 
      width: 100,
      render: (id) => (
        <Text copyable={{ text: id }} style={{ fontSize: '12px' }}>
          {id?.slice(-8) || 'N/A'}
        </Text>
      )
    },
    { 
      title: "Reporter", 
      key: "reporter", 
      width: 100,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.reporter?.name || 'No name'}
            </div>
            {/* <div style={{ fontSize: '12px', color: '#999' }}>
              {record.reporter?.email || 'No email'}
            </div> */}
          </div>
        </div>
      )
    },
    { 
      title: "Reported User", 
      key: "reportedUser", 
      width: 100,
      render: (_, record) => {
        if (!record.reportedUser) {
          return <Text type="secondary">No reported user</Text>;
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div>
              <div style={{ fontWeight: 500 }}>
                {record.reportedUser?.name || 'No name'}
              </div>
              {/* <div style={{ fontSize: '12px', color: '#999' }}>
                {record.reportedUser?.email || 'No email'}
              </div> */}
            </div>
          </div>
        );
      }
    },
    { 
      title: "Date Created", 
      dataIndex: "createAt", 
      key: "createAt",
      width: 100,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
    },
    { 
      title: "Type", 
      dataIndex: "type", 
      key: "type",
      width: 100,
      render: (type) => (
        <Tag color="orange">{type || 'Other'}</Tag>
      )
    },
    // { 
    //   title: "Category", 
    //   dataIndex: "category", 
    //   key: "category",
    //   width: 150,
    //   render: (category) => {
    //     const categoryLabels = {
    //       customer_report_owner: "Customer Report",
    //       owner_report_customer: "Owner Report",
    //       general: "General Report",
    //       other: "Other"
    //     };
    //     const categoryColors = {
    //       customer_report_owner: "orange",
    //       owner_report_customer: "purple",
    //       general: "cyan",
    //       other: "default"
    //     };
    //     return (
    //       <Tag color={categoryColors[category] || 'default'}>
    //         {categoryLabels[category] || category || 'Unknown'}
    //       </Tag>
    //     );
    //   }
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={statusColors[status?.toLowerCase()] || 'default'}>
          {statusLabels[status?.toLowerCase()] || status || 'Unknown'}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            style={{ border: 'none', display: 'inline-block' }}
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              onView && onView(record);
            }}
          >
          </Button>
          {record.status?.toLowerCase() === 'pending' && (
            <Button 
              size="small" 
              style={{ border: 'none', display: 'inline-block' }}
              icon={<CheckOutlined />}
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                onResolve && onResolve(record);
              }}
            >
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="_id"
      pagination={pagination}
      onChange={onChange}
      scroll={{ x: 1000 }}
      onRow={(record) => ({
        onClick: () => onView && onView(record),
        style: { cursor: 'pointer' }
      })}
      locale={{
        emptyText: <Alert message="No reports available." type="info" showIcon />,
      }}
    />
  );
};

export default ReportsTable;
