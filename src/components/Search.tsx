import React, { useState } from "react";
import "./Search.css";
import "bootstrap/dist/css/bootstrap.min.css";

interface Props {
  items: string[];
  heading: string;
  onSelect: (section: string) => void;
  selected: string;
}

const Search: React.FC<Props> = ({ items, heading, onSelect, selected }) => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // 新状态用于追踪是否点击

  // 切换导航栏的展开和收回
  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
    setIsClicked(true); // 设置为 true 以显示边框
    setTimeout(() => setIsClicked(false), 300); // 300ms 后移除边框
  };

  // 选择导航项时关闭导航栏（对于小屏幕）
  const handleSelect = (item: string) => {
    onSelect(item.toLowerCase()); // 确保传递给 onSelect 回调的是小写字母
    setIsNavExpanded(false); // 选择后自动收回导航栏
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-setting container-fluid align-items-center">
      <a className="navbar-brand text-white fs-5 ps-4 fw-light" href="#">
        {heading}
      </a>
      <button
        style={{
          color: "Silver",
          borderRadius: "8px",
          border: isClicked ? "0.8px solid Silver" : "none", // 使用内联样式动态设置边框
        }}
        className="navbar-toggler p-1 me-3 fs-6"
        type="button"
        onClick={toggleNav}
        aria-controls="navbarNav"
        aria-expanded={isNavExpanded ? "true" : "false"}
        aria-label="Toggle navigation"
      >
        {/* SVG icon 或其他图标 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-list"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>
      <div
        className={`collapse navbar-collapse ${isNavExpanded ? "show" : ""}`}
        id="navbarNav"
      >
        <ul className="navbar-nav ms-auto px-5">
          {items.map((item, index) => (
            <li
              className={`nav-item right-one ${
                item.toLowerCase() === selected ? "nav-border" : ""
              }`}
              key={item}
              onClick={() => handleSelect(item)}
            >
              <a className="nav-link" href="#">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Search;
