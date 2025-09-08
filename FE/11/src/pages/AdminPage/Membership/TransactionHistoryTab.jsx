import React, { useState, useEffect } from "react";
import { Table, Input, DatePicker, Select, Space, Tag, Alert, Button, message, Spin, Statistic, Row, Col, Card, Typography } from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getTransactionHistory } from "../../../services/transactionService";
import TransactionDetailModal from "./TransactionDetailModal";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const statusColors = {
  success: "green",
  paid: "green",
  "Paid": "green",
  failed: "red",
  "Failed": "red", 
  pending: "orange",
  "Pending": "orange",
};

const TransactionHistoryTab = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [summary, setSummary] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    dateRange: [],
    status: undefined,
  });
  const [messageApi, contextHolder] = message.useMessage();

  // Load transactions from API
  const loadTransactions = async (customParams = {}) => {
    setLoading(true);
    try {
      const apiParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...customParams
      };

      // Add date range filter
      if (filters.dateRange && filters.dateRange.length === 2) {
        apiParams.fromDate = filters.dateRange[0].format('YYYY-MM-DD');
        apiParams.toDate = filters.dateRange[1].format('YYYY-MM-DD');
      }

      // Add other filters
      if (filters.status) apiParams.status = filters.status;
      if (filters.search) apiParams.search = filters.search;

      const response = await getTransactionHistory(apiParams);
      
      console.log('Transaction response:', response); // Debug log
      console.log('Sample transaction:', response.transactions?.[0]); // Debug log
      
      if (response.transactions) {
        setTransactions(response.transactions);
        console.log('Set transactions:', response.transactions.length); // Debug log
        setPagination(prev => ({
          ...prev,
          total: response.total
        }));
        setSummary(response.summary);
        
        if (response.total === 0) {
          messageApi.info('No transactions found with current filters');
        }
      } else {
        setTransactions([]);
        messageApi.info('No transaction data available');
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      
      if (error.response?.data?.message === 'Access token required' || 
          error.message === 'Authentication required') {
        messageApi.error('Session expired. Please login again!');
      } else {
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Error loading transactions!';
        messageApi.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load transactions on component mount and when dependencies change
  useEffect(() => {
    loadTransactions();
  }, [pagination.current, pagination.pageSize, filters.search, filters.status, filters.dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle pagination changes
  const handleTableChange = (paginationConfig) => {
    setPagination(prev => ({
      ...prev,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize
    }));
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page
  };

  const columns = [
    { 
      title: "Date", 
      dataIndex: "date", 
      key: "date", 
      render: d => dayjs(d).format("DD/MM/YYYY HH:mm"),
      width: 150
    },
    { 
      title: "Transaction ID", 
      dataIndex: "transactionId", 
      key: "transactionId",
      render: (id, record) => {
        console.log('Transaction ID render:', { id, record }); // Debug log
        const displayId = record.transactionId;
        console.log('Display ID:', displayId); // Debug log
        return (
          <Button 
            type="link" 
            style={{border: 'none', display: 'inline-block'  }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              setSelectedTransaction(record);
            }}
          >
            {displayId && displayId.length > 12 ? `${displayId.substring(0, 12)}...` : displayId}
          </Button>
        );
      },
      width: 150
    },
    { 
      title: "Buyer", 
      dataIndex: "sender", 
      key: "sender",
      render: (sender) => sender?.name || sender,
      width: 120
    },
    { 
      title: "Type", 
      dataIndex: "transactionType", 
      key: "transactionType",
      render: (type) => type || "Membership Purchase",
      width: 150
    },
    { 
      title: "Package", 
      dataIndex: "membershipPackage", 
      key: "membershipPackage",
      render: (pkg) => pkg?.packageName || "-",
      width: 120
    },
    { 
      title: "Amount", 
      dataIndex: "amount", 
      key: "amount", 
      render: v => <Text strong style={{ color: "#fa8c16" }}>{v?.toLocaleString()} VNĐ</Text>,
      width: 120
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: status => (
        <Tag color={statusColors[status] || "default"}>
          {status?.toUpperCase()}
        </Tag>
      ),
      width: 100
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="text"
          style={{ padding: 0, fontWeight: 200, border: 'none', display: 'inline-block' }}
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click
            setSelectedTransaction(record);
          }}
          size="small"
        >
        </Button>
      ),
      width: 80
    }
  ];

  return (
    <div>
      {contextHolder}
      
      {/* Summary Statistics */}
      {summary && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Card size="small">
              <Statistic 
                title="Total Transactions" 
                value={summary.totalTransactions} 
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small">
              <Statistic 
                title="Total Amount" 
                value={summary.totalAmount} 
                formatter={value => `${value?.toLocaleString()} VNĐ`}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small">
              <Statistic 
                title="Success Rate" 
                value={(summary.statusBreakdown?.find(s => s._id === 'success')?.count || 0) + 
                       (summary.statusBreakdown?.find(s => s._id === 'Paid')?.count || 0)} 
                suffix={`/ ${summary.totalTransactions}`}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input.Search
          placeholder="Search by transaction ID, title, description..."
          value={filters.search}
          onChange={e => handleFilterChange({ ...filters, search: e.target.value })}
          style={{ width: 250 }}
          allowClear
        />
        <RangePicker
          placeholder={["From Date", "To Date"]}
          value={filters.dateRange}
          onChange={dates => handleFilterChange({ ...filters, dateRange: dates || [] })}
        />
        <Select
          placeholder="Status"
          allowClear
          value={filters.status}
          onChange={v => handleFilterChange({ ...filters, status: v })}
          style={{ width: 120 }}
        >
          <Option value="success">Success</Option>
          <Option value="Paid">Paid</Option>
          <Option value="failed">Failed</Option>
          <Option value="pending">Pending</Option>
        </Select>
        <Button 
          icon={<ReloadOutlined />}
          onClick={() => loadTransactions()}
          loading={loading}
        >
          Refresh
        </Button>
      </Space>

      {/* Transactions Table */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="_id"
          onRow={(record) => ({
            onClick: () => setSelectedTransaction(record),
            style: { cursor: 'pointer' },
            onMouseEnter: (e) => {
              e.target.closest('tr').style.backgroundColor = '#f5f5f5';
            },
            onMouseLeave: (e) => {
              e.target.closest('tr').style.backgroundColor = '';
            }
          })}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} transactions`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          onChange={handleTableChange}
          locale={{
            emptyText: (
              <Alert 
                message="No transactions found" 
                description="Try adjusting your filters or check back later for new transactions"
                type="info" 
                showIcon 
              />
            ),
          }}
          scroll={{ x: 1000 }}
        />
      </Spin>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        open={!!selectedTransaction}
        onCancel={() => setSelectedTransaction(null)}
        record={selectedTransaction}
      />
    </div>
  );
};

export default TransactionHistoryTab;