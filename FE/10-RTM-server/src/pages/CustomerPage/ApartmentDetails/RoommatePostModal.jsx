// components/RoommatePostModal.jsx
import { Modal, Form, Input, DatePicker, InputNumber, Select, Checkbox, Button } from 'antd';
import { useState } from 'react';
import { createRoommatePost } from '../../../services/roommateAPI';

const RoommatePostModal = ({ visible, onClose, accommodationId, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await createRoommatePost({
        ...values,
        accommodationId,
      });
      onSuccess?.(); // reload list
      onClose();
    } catch (error) {
      console.error("Failed to post roommate", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title="Find a Roommate">
      <Form layout="vertical" onFinish={handleFinish}>
        <Form.Item name="intro" label="Introduce yourself" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="genderPreference" label="Gender Preference">
          <Select defaultValue="Any">
            <Select.Option value="other">Other</Select.Option>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="habits" label="Habits">
          <Checkbox.Group options={["Clean", "Quiet", "Smoker", "Night Owl"]} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Post
        </Button>
      </Form>
    </Modal>
  );
};

export default RoommatePostModal;
