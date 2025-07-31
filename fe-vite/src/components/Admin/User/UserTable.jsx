import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Popconfirm,
  message,
  notification,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import "./userTable.scss";
import { callDeleteUser, callFetchUser } from "../../../services/api";
import UserViewDetail from "./UserViewDetail";
import UserModalCreate from "./UserModalCreate";
import UserModalUpdate from "./UserModalUpdate";

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ name: "", email: "", phone: "" });
  const [sortQuery, setSortQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState();
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1100);
    };

    handleResize(); // gọi 1 lần khi load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = [
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
      render: (text, record) => (
        <a
          href="#"
          style={{ color: "#4096ff", textDecoration: "none" }}
          onClick={() => {
            setDataViewDetail(record);
            setOpenViewDetail(true);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: true,
      render: (role) => (
        <span style={{ color: role === "ADMIN" ? "#ff4d4f" : "#36b678ff" }}>
          {role}
        </span>
      ),
    },
    {
      title: "Hành động",
      align: "center",
      render: (text, record) => (
        <>
          <Popconfirm
            placement="leftTop"
            title="Xác nhận xóa user"
            description="Bạn có chắc chắn muốn xóa user này?"
            onConfirm={() => handleDeleteUser(record._id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <span style={{ cursor: "pointer", marginRight: 20 }}>
              <DeleteTwoTone twoToneColor="#ff4d4f" />
            </span>
          </Popconfirm>
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setOpenModalUpdate(true);
              setDataUpdate(record);
            }}
          />
        </>
      ),
    },
  ];

  const fetchUser = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filters.name) query += `&fullName=/${filters.name}/i`;

    if (filters.email) {
      notification.error({
        message: "Thông báo",
        description: "Chức năng tìm kiếm theo email chưa được triển khai.",
      });
    }

    if (filters.phone) {
      notification.error({
        message: "Thông báo",
        description:
          "Chức năng tìm kiếm theo số điện thoại chưa được triển khai.",
      });
    }

    if (sortQuery) query += `&${sortQuery}`;

    try {
      const res = await callFetchUser(query);
      if (res?.data) {
        setListUser(res.data.result);
        setTotal(res.data.meta.total);
      }
    } catch (error) {
      console.error("Lỗi khi fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, sortQuery]);

  const handleDeleteUser = async (id) => {
    const res = await callDeleteUser(id);
    if (res && res.data) {
      message.success("Xóa người dùng thành công!");
      fetchUser();
    } else {
      notification.error({
        message: "Thông báo",
        description: res?.message || "Xóa người dùng thất bại!",
      });
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (pagination.current !== current) setCurrent(pagination.current);
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    if (sorter?.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
  };

  const renderHeader = () => (
    <div className="header-table-container">
      <h6>Danh sách user</h6>
      <div className="header-actions">
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setOpenModalCreate(true)}
          className="btn-add"
        >
          Thêm người dùng
        </Button>
        <Button
          type="ghost"
          onClick={() => {
            setFilters({ name: "", email: "", phone: "" });
            setSortQuery("");
            setCurrent(1);
            fetchUser();
          }}
          className="btn-reload"
        >
          <ReloadOutlined />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="search">
        <div className="user-name">
          <h6>Tên hiển thị</h6>
          <Input
            className="search-input"
            value={filters.name}
            placeholder="Nhập tên người dùng"
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>

        <div className="user-email">
          <h6>Email</h6>
          <Input
            className="search-input"
            value={filters.email}
            placeholder="Tạm thời chưa dùng được"
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          />
        </div>

        <div className="user-phone">
          <h6>Số điện thoại</h6>
          <Input
            className="search-input"
            value={filters.phone}
            placeholder="Tạm thời chưa dùng được"
            onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="button">
        <Button
          className="button-action"
          type="primary"
          onClick={() => fetchUser()}
        >
          Tìm kiếm
        </Button>
        <Button
          className="button-action"
          onClick={() => {
            setFilters({ name: "", email: "", phone: "" });
            setSortQuery("");
            setCurrent(1);
            fetchUser();
          }}
        >
          Xóa lọc
        </Button>
      </div>

      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            bordered
            columns={columns}
            dataSource={listUser}
            rowKey="_id"
            onChange={handleTableChange}
            scroll={isMobile ? { x: "max-content" } : undefined}
            pagination={{
              current,
              pageSize,
              total,
              showSizeChanger: true,
              showTotal: (total, range) => (
                <div>
                  {range[0]}-{range[1]} trên {total} người dùng
                </div>
              ),
            }}
          />
        </Col>
      </Row>

      <UserViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <UserModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchUser={fetchUser}
      />

      <UserModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        fetchUser={fetchUser}
      />
    </>
  );
};

export default UserTable;
