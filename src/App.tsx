import React, { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";
import Search from "./components/Search";
import { getCompanyProfile, CompanyProfile } from "./finnhub";
import { searchSymbols, AutocompleteResult } from "./finnhub";
import { StockQuote, getStockQuote } from "./finnhub";
import { getCompanyNews, CompanyNews } from "./finnhub";
import { InsiderSentiment, fetchInsiderSentiment } from "./finnhub";
import { CompanyEarnings, getCompanyEarnings } from "./finnhub";
import { CompanyRecommendationTrend, getRecommendationTrends } from "./finnhub";
import { getCompanyPeers } from "./finnhub";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import IndicatorsCore from "highcharts/indicators/indicators";
import VbpIndicator from "highcharts/indicators/volume-by-price";
import More from "highcharts/highcharts-more";
IndicatorsCore(Highcharts);
VbpIndicator(Highcharts);
More(Highcharts);
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import CircularProgress from "@mui/material/CircularProgress";
import CurrentTimeDisplay from "./components/Time";

function App() {
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    const savedPortfolio = localStorage.getItem("portfolio");
    const savedMoneyInWallet = localStorage.getItem("moneyInWallet");

    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }

    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }

    if (savedMoneyInWallet) {
      setMoneyInWallet(JSON.parse(savedMoneyInWallet));
    }
  }, []);

  let items = ["Search", "Watchlist", "Portfolio"];
  const [selectedSection, setSelectedSection] = useState("search");
  const handleSelection = (section: string) => {
    if (section === "watchlist") {
      // 如果用户选择了 "Watchlist"，显示 spinner
      handleWatchlistClick();
    } else if (section === "portfolio") {
      handlePortfolioClick();
    } else {
      // 对于其他部分，直接切换而不显示 spinner
      setSelectedSection(section);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = () => {
    setSearchQuery(""); //清除搜索框的内容
    setAutocompleteResults([]); //清除搜索框
    setCompanyProfile(null); //清除公司内容
    setShowNoDataMessage(false);
    if (noDataMessageTimer !== null) {
      clearTimeout(noDataMessageTimer); // 如果定时器存在，清除定时器
      setNoDataMessageTimer(null); // 重置定时器ID
    }
  };

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(
    null
  );

  const [autocompleteResults, setAutocompleteResults] = useState<
    AutocompleteResult[]
  >([]);

  //添加状态保存股票交易信息
  const [stockQuote, setStockQuote] = useState<StockQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* 当没有数据显示时 */
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [noDataMessageTimer, setNoDataMessageTimer] = useState<null | number>(
    null
  );

  const handleSearch3 = async (query: string) => {
    setShowNoDataMessage(false); // 每次搜索前重置无数据信息的显示状态
    if (!query) return;
    setIsLoading(true);
    try {
        const symbols = await searchSymbols(query);
        setAutocompleteResults(symbols);
        if (symbols.length === 0) { // 如果没有搜索结果
            setShowNoDataMessage(true); // 显示没有数据的信息
        }
    } catch (error) {
        console.error("Failed to fetch autocomplete results:", error);
    } finally {
        setIsLoading(false);
    }
};


  useEffect(() => {
    if (!isLoading && autocompleteResults.length === 0 && searchQuery) {
      const timer = setTimeout(() => {
        setShowNoDataMessage(true);
      }, 2000);
    } else {
      setShowNoDataMessage(false);
    }
  }, [isLoading, autocompleteResults]);

  useEffect(() => {
    if (showNoDataMessage) {
      const timer = setTimeout(() => {
        setShowNoDataMessage(false);
      }, 8000); // 8秒后自动隐藏消息
      setNoDataMessageTimer(timer);

      return () => clearTimeout(timer); // 组件卸载或者showNoDataMessage变化时清除定时器
    }
  }, [showNoDataMessage]);

  /* sadfsiadfjdslkflsdjfkds */
  /* sadfsiadfjdslkflsdjfkds */
  /* sadfsiadfjdslkflsdjfkds */
  /* sadfsiadfjdslkflsdjfkds */
  /* sadfsiadfjdslkflsdjfkds */
  // When a selection is made from the autocomplete dropdown

  
  const handleDropdownSelection = async (symbol: string) => {
    setShowNoDataMessage(false); // 首先确保不显示无数据消息
    if (noDataMessageTimer !== null) {
        clearTimeout(noDataMessageTimer);
        setNoDataMessageTimer(null);
    }

    setIsLoading(true);
    try {
        const profile = await getCompanyProfile(symbol);
        if (profile) { // 如果成功获取到公司简介
            setCompanyProfile(profile);
            setShowNoDataMessage(false); // 确保不显示无数据消息
        } else { // 如果没有获取到公司简介
            setShowNoDataMessage(true); // 显示没有数据的信息
        }
    } catch (error) {
        console.error("Failed to fetch company profile:", error);
        setShowNoDataMessage(true); // 如果发生错误也显示没有数据的信息
    } finally {
        setIsLoading(false);
    }
};

  // Adjusting the useEffect hook for showing no data message
  useEffect(() => {
    // 如果处于加载状态或者已经成功获取到了公司简介（companyProfile不为空），则不显示无数据消息。
    if (isLoading || companyProfile !== null) {
      setShowNoDataMessage(false);
      if (noDataMessageTimer !== null) {
        clearTimeout(noDataMessageTimer);
        setNoDataMessageTimer(null);
      }
    } else if (!isLoading && companyProfile === null && searchQuery) {
      // 如果不在加载状态，且未获取到公司简介（companyProfile为空），且有搜索词（searchQuery不为空）时，
      // 开始计时以后显示无数据消息。
      const timer = setTimeout(() => {
        setShowNoDataMessage(true);
      }, 2000); // 这里的2000是延迟时间，可以根据实际需求调整
      setNoDataMessageTimer(timer);
    }
  
    // 清理函数，用于组件卸载或者依赖项变化时清除定时器
    return () => {
      if (noDataMessageTimer !== null) {
        clearTimeout(noDataMessageTimer);
        setNoDataMessageTimer(null);
      }
    };
  }, [isLoading, companyProfile, searchQuery, noDataMessageTimer]); // 把companyProfile添加到依赖数组
  

  /* sldihflksdfkjsalfjasjfklasj */
  /* sldihflksdfkjsalfjasjfklasj */
  /* sldihflksdfkjsalfjasjfklasj */
  /* sldihflksdfkjsalfjasjfklasj */
  /* sldihflksdfkjsalfjasjfklasj */
  /* sldihflksdfkjsalfjasjfklasj */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query); // 更新组件的状态
    latestQueryRef.current = query; // 更新 ref

    if (query.length > 0) {
      setIsLoading(true);
      debouncedSearchSymbols(query);
    } else {
      setIsLoading(false);
      setAutocompleteResults([]);
    }
  };

  function debounce(fn: (query: string) => void, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const debounced = (...args: any) => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        setIsLoading(true);
      }
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };

    return debounced;
  }

  const latestQueryRef = useRef("");

  const debouncedSearchSymbols = debounce(async (query) => {
    setIsLoading(true);
    try {
      const symbols = await searchSymbols(query);
      // 使用 current 属性来获取最新的搜索词
      if (
        query === latestQueryRef.current &&
        latestQueryRef.current.length > 0
      ) {
        setAutocompleteResults(symbols);
      } else {
        // 如果当前 ref 的值为空或者和传入的 query 不一致，就不设置结果
        setAutocompleteResults([]);
      }
    } catch (error) {
      console.error("Failed to fetch autocomplete results:", error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  //管理4tabs
  const [activeTab, setActiveTab] = useState<string | null>(null);

  //改变tab
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  //公司新闻
  const [companyNews, setCompanyNews] = useState<CompanyNews[]>([]);

  useEffect(() => {
    if (searchQuery) {
      fetchCompanyNews(searchQuery);
    }
  }, [searchQuery]); // 确保 searchQuery 是依赖项

  const fetchCompanyNews = async (symbol: string) => {
    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    const toDate = new Date();

    const fromDateString: string = fromDate.toISOString().split("T")[0];
    const toDateString: string = toDate.toISOString().split("T")[0];
    try {
      const news = await getCompanyNews(symbol, fromDateString, toDateString);
      setCompanyNews(news);
    } catch (error) {
      console.error(`Failed to fetch news for ${symbol}:`, error);
    }
    console.log(`Rendering news:`, companyNews);
  };

  /* ************************* */
  /* ************************* */
  /* **************************/
  /* ******NewsModal区域****** */
  /* ************************* */
  /* ************************* */
  /* ************************* */
  const [showModal, setShowModal] = useState(false);
  const [currentNews, setCurrentNews] = useState<CompanyNews | null>(null);

  // Function to open modal with news item
  const handleNewsClick = (news: CompanyNews) => {
    setCurrentNews(news);
    setShowModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentNews(null);
  };

  /* 新闻弹窗页面转换成要求时间格式 */
  const formatDate2 = (unixTimestamp: number) => {
    // 将 Unix 时间戳（秒）转换为毫秒
    const date = new Date(unixTimestamp * 1000);

    // 使用 toLocaleDateString 格式化日期
    return date.toLocaleDateString("en-US", {
      month: "long", // 月份全称
      day: "numeric", // 日期数字
      year: "numeric", // 四位年份
    });
  };

  /* 新闻弹窗页面 */
  type NewsModalProps = {
    show: boolean;
    onClose: () => void;
    newsItem: {
      image?: string;
      headline: string;
      summary: string;
      source: string;
      datetime: number;
      url: string;
    } | null; // Allow newsItem to be null
  };

  const NewsModal: React.FC<NewsModalProps> = ({ show, onClose, newsItem }) => {
    if (!show || !newsItem) {
      return null;
    }

    const shareOnTwitter = () => {
      const text = newsItem.headline;
      const url = newsItem.url;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, "_blank");
    };

    const shareOnFacebook = () => {
      const url = newsItem.url;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`;
      window.open(facebookUrl, "_blank");
    };

    return (
      <>
        <div className="backdrop" />
        <div className="news-modal">
          <div className="d-flex justify-content-between">
            <h3>{newsItem.source}</h3>
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "none",
              }}
            >
              <i
                className="bi bi-x"
                style={{ color: "#0073e6", fontSize: "0.7rem" }}
              ></i>
              <div
                style={{
                  border: "0.2px solid #0073e6",
                  width: "calc(70%)",
                  marginTop: "-6px",
                  marginLeft: "2px",
                }}
              ></div>
            </button>
          </div>
          <p
            style={{
              fontSize: "12px",
              marginTop: "-12px",
              marginBottom: "10px",
              color: "grey",
            }}
          >
            {formatDate2(newsItem.datetime)}
          </p>
          <div
            style={{
              border: "0.2px solid rgba(211, 211, 211, 0.5)",
              width: "calc(100% + 20px)",
              margin: "10px -10px",
            }}
          ></div>
          <p style={{ lineHeight: "1.2" }}>{newsItem.headline}</p>
          <p
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "11px",
              color: "rgb(88,88,88)",
              marginTop: "-15px",
            }}
          >
            {newsItem.summary}
          </p>
          <p style={{ fontSize: "11px", color: "grey", marginTop: "-15px" }}>
            For more details click <a href={newsItem.url}>here</a>
          </p>

          <div style={{ border: "1px solid LightGray", borderRadius: "5px" }}>
            <p
              className="ps-2 pt-3"
              style={{ color: "rgb(88,88,88)", fontSize: "14px" }}
            >
              share
            </p>
            <div className="d-flex" style={{ marginTop: "-15px" }}>
              <button
                className="btn"
                style={{
                  border: "none",
                  background: "none",
                  marginRight: "-20px",
                }}
                onClick={shareOnTwitter}
              >
                <i
                  className="bi bi-twitter-x"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              </button>
              <button
                className="btn"
                style={{
                  border: "none",
                  background: "none",
                  marginLeft: "10px",
                  color: "blue",
                }}
                onClick={shareOnFacebook}
              >
                <i
                  className="bi bi-facebook"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  /* ************************* */
  /* ************************* */
  /* ************************* */
  /* ******BuyModal区域****** */
  /* ************************* */
  /* ************************* */
  /* ************************* */

  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
  const [selectedStockForTransaction, setSelectedStockForTransaction] =
    useState<PortfolioItem | null>(null);

  const openBuyModal = (stock: PortfolioItem) => {
    setSelectedStockForTransaction(stock);
    setIsBuyModalOpen(true);
  };

  // 使用类型断言确保companyProfile和stockQuote不为null
  const currentStockAsPortfolioItem: PortfolioItem = {
    companyProfile: companyProfile as CompanyProfile,
    stockQuote: stockQuote as StockQuote,
    quantity: 0,
    totalCost: 0,
  };

  // 然后将currentStockAsPortfolioItem作为参数传递给函数

  const closeBuyModal = () => {
    setIsBuyModalOpen(false);
  };

  type BuyModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirmBuy: (quantity: number) => void;
    currentPrice: number;
    moneyInWallet: number;
    currentStock: string;
  };

  const BuyModal: React.FC<BuyModalProps> = ({
    isOpen,
    onClose,
    onConfirmBuy,
    currentPrice,
    moneyInWallet,
    currentStock,
  }) => {
    const [quantity, setQuantity] = useState<string>("0");

    if (!isOpen) return null;

    const total = Number(quantity) * currentPrice;
    const canBuy = total <= moneyInWallet && Number(quantity) > 0;
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = e.target.value;
      // 只有当新的数量是数字时才更新状态
      if (!newQuantity || !isNaN(Number(newQuantity))) {
        setQuantity(newQuantity);
      }
    };

    return (
      <div className="buy-modal">
        <div className="backdrop" />
        <div className="modal-content2">
          <div className="d-flex justify-content-between mb-4">
            <h2 className="fs-6">{currentStock}</h2>
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "none",
              }}
            >
              <i
                className="bi bi-x"
                style={{ color: "#0073e6", fontSize: "0.7rem" }}
              ></i>
              <div
                style={{
                  border: "0.2px solid #0073e6",
                  width: "calc(70%)",
                  marginTop: "-6px",
                  marginLeft: "2px",
                }}
              ></div>
            </button>
          </div>
          <div
            style={{
              border: "0.2px solid rgba(211, 211, 211, 0.5)",
              width: "calc(100% + 20px)",
              margin: "10px -10px",
            }}
          ></div>
          <div
            className="py-2 px-3"
            style={{ fontSize: "12px", lineHeight: "0.1" }}
          >
            <p>Current Price: {(currentPrice || 0).toFixed(2)}</p>
            <p>Money in Wallet: ${(moneyInWallet || 0).toFixed(2)}</p>
            <div className="d-flex justify-content-between">
              <p style={{ alignSelf: "center", margin: 0 }}>Quantity:&nbsp;</p>
              <input
                type="number"
                value={quantity}
                min="0"
                onChange={handleQuantityChange}
                className="form-control form-control-sm h-50"
              />
            </div>
            {!canBuy && Number(quantity) > 0 && (
              <p className="mt-3" style={{ color: "red" }}>
                Not enough money in wallet!
              </p>
            )}
          </div>
          <div
            style={{
              border: "0.2px solid rgba(211, 211, 211, 0.5)",
              width: "calc(100% + 20px)",
              margin: "10px -10px",
            }}
          ></div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <p style={{ fontSize: "12px", alignSelf: "center", margin: 0 }}>
              Total: {(total || 0).toFixed(2)}
            </p>
            <button
              onClick={() => canBuy && onConfirmBuy(Number(quantity))}
              disabled={!canBuy}
              type="button"
              className="btn btn-success btn-sm"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [moneyInWallet, setMoneyInWallet] = useState<number>(25000);

  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState("");

  const handleConfirmBuy = (quantity: number) => {
    if (!stockQuote || !companyProfile || !selectedStockForTransaction) return;

    const purchaseAmount = quantity * selectedStockForTransaction.stockQuote.c;
    if (moneyInWallet >= purchaseAmount) {
      setMoneyInWallet((prevMoney) => {
        const newBalance = prevMoney - purchaseAmount;
        localStorage.setItem("moneyInWallet", JSON.stringify(newBalance));
        return newBalance;
      });

      setPortfolio((prevPortfolio) => {
        const index = prevPortfolio.findIndex(
          (item) =>
            item.companyProfile.ticker ===
            selectedStockForTransaction.companyProfile.ticker
        );

        let newPortfolio;
        if (index >= 0) {
          newPortfolio = prevPortfolio.map((item, idx) =>
            idx === index
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  totalCost: item.totalCost + purchaseAmount,
                }
              : item
          );
        } else {
          newPortfolio = [
            ...prevPortfolio,
            {
              companyProfile: selectedStockForTransaction.companyProfile,
              stockQuote: selectedStockForTransaction.stockQuote,
              quantity: quantity,
              totalCost: purchaseAmount,
            },
          ];
        }

        localStorage.setItem("portfolio", JSON.stringify(newPortfolio)); // Update localStorage
        return newPortfolio;
      });

      setPurchaseMessage(`${companyProfile.ticker} bought successfully.`);
      setShowPurchaseSuccess(true);
      setTimeout(() => setShowPurchaseSuccess(false), 5000);

      closeBuyModal();
    } else {
      alert("Not enough balance to make the purchase.");
    }
  };

  /* ************************* */
  /* ************************* */
  /* ************************* */
  /* ******SellModal区域****** */
  /* ************************* */
  /* ************************* */
  /* ************************* */

  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);

  const openSellModal = (stock: PortfolioItem) => {
    setSelectedStockForTransaction(stock);
    setIsSellModalOpen(true);
  };

  const openSellModal2 = () => {
    setIsSellModalOpen(true);
  };

  const closeSellModal = () => {
    setIsSellModalOpen(false);
  };

  type SellModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirmSell: (quantity: number) => void;
    currentPrice: number;
    moneyInWallet: number;
    currentStock: string;
    availableShares: number; // 这里添加了可卖出的股份数量
  };

  const SellModal: React.FC<SellModalProps> = ({
    isOpen,
    onClose,
    onConfirmSell,
    currentPrice,
    moneyInWallet,
    currentStock,
    availableShares, // 添加了可卖出的股份数量
  }) => {
    const [quantity, setQuantity] = useState<string>("0");

    if (!isOpen) return null;

    const total = Number(quantity) * currentPrice;
    const canSell = Number(quantity) > 0 && Number(quantity) <= availableShares; // 确保卖出数量不超过持有数量
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = e.target.value;
      if (!newQuantity || !isNaN(Number(newQuantity))) {
        setQuantity(newQuantity);
      }
    };

    return (
      <div className="sell-modal">
        <div className="backdrop" onClick={onClose} />
        <div className="modal-content2">
          <div className="d-flex justify-content-between mb-4">
            <h2 className="fs-6">{currentStock}</h2>
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "none",
              }}
            >
              <i
                className="bi bi-x"
                style={{ color: "#0073e6", fontSize: "0.7rem" }}
              ></i>
              <div
                style={{
                  border: "0.2px solid #0073e6",
                  width: "calc(70%)",
                  marginTop: "-6px",
                  marginLeft: "2px",
                }}
              ></div>
            </button>
          </div>
          <div
            style={{
              border: "0.2px solid rgba(211, 211, 211, 0.5)",
              width: "calc(100% + 20px)",
              margin: "10px -10px",
            }}
          ></div>
          <div
            className="py-2 px-3"
            style={{ fontSize: "12px", lineHeight: "0.1" }}
          >
            <p>Current Price: {(currentPrice || 0).toFixed(2)}</p>
            <p>Money in Wallet: ${(moneyInWallet || 0).toFixed(2)}</p>
            {/* <p>Available Shares: {availableShares}</p> */}
            <div className="d-flex justify-content-between">
              <p style={{ alignSelf: "center", margin: 0 }}>Quantity:&nbsp;</p>
              <input
                type="number"
                value={quantity}
                min="0"
                onChange={handleQuantityChange}
                className="form-control form-control-sm h-50"
              />
            </div>
            {!canSell && Number(quantity) > 0 && (
              <p className="mt-3" style={{ color: "red" }}>
                You cannot sell the stock that you don't have!
              </p>
            )}
          </div>
          <div
            style={{
              border: "0.2px solid rgba(211, 211, 211, 0.5)",
              width: "calc(100% + 20px)",
              margin: "10px -10px",
            }}
          ></div>

          <div className="d-flex justify-content-between align-items-center mt-2">
            <p style={{ fontSize: "12px", alignSelf: "center", margin: 0 }}>
              Total: {(total || 0).toFixed(2)}
            </p>
            <button
              onClick={() => canSell && onConfirmSell(Number(quantity))}
              disabled={!canSell}
              type="button"
              className="btn btn-success btn-sm"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [showSellSuccess, setShowSellSuccess] = useState(false);
  const [sellMessage, setSellMessage] = useState("");

  const handleConfirmSell = (quantity: number) => {
    if (!companyProfile || !stockQuote || !selectedStockForTransaction) return;

    setPortfolio((prevPortfolio) => {
      const index = prevPortfolio.findIndex(
        (item) =>
          item.companyProfile.ticker ===
          selectedStockForTransaction.companyProfile.ticker
      );
      if (index >= 0 && quantity <= prevPortfolio[index].quantity) {
        const saleAmount = quantity * selectedStockForTransaction.stockQuote.c;
        setMoneyInWallet((prevMoney) => {
          const newBalance = prevMoney + saleAmount;
          localStorage.setItem("moneyInWallet", JSON.stringify(newBalance));
          return newBalance;
        });

        const newPortfolio = prevPortfolio
          .map((item, idx) => {
            if (idx === index) {
              return {
                ...item,
                quantity: item.quantity - quantity,
                totalCost: item.totalCost - saleAmount,
              };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);

        localStorage.setItem("portfolio", JSON.stringify(newPortfolio)); // Update localStorage
        return newPortfolio;
      } else {
        alert("Cannot sell more shares than you own.");
        return prevPortfolio; // Return previous portfolio if sale is not valid
      }
    });

    setSellMessage(`${companyProfile.ticker} sold successfully.`);
    setShowSellSuccess(true);
    setTimeout(() => setShowSellSuccess(false), 5000);

    closeSellModal();
  };

  /* ************************* */
  /* ************************* */
  /* **************************/
  /* ******Tab3 Chart区域****** */
  /* ************************* */
  /* ************************* */
  /* ************************* */

  const [chartData, setChartData] = useState({
    priceData: [],
    volumeData: [],
  });

  const groupingUnits = [
    [
      "day", // unit name
      [1], // allowed multiples
    ],
    ["week", [1]],
  ];
  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) {
        return;
      }
      const from = new Date();
      from.setFullYear(from.getFullYear() - 2); // 设置为2年前
      const to = new Date(); // 设置为当前日期

      const fromDateString = from.toISOString().split("T")[0];
      const toDateString = to.toISOString().split("T")[0];

      const apiKey = "aiyZqSXaXGsuupDXfFkaWeUEyMO6ooZU";
      const ticker = searchQuery;
      const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDateString}/${toDateString}?adjusted=true&sort=asc&apiKey=${apiKey}`;

      try {
        const response = await axios.get(url);
        if (response.data && response.data.results) {
          const data = response.data.results || [];
          const priceData = data.map((item: StockQuote) => [
            item.t,
            item.o,
            item.h,
            item.l,
            item.c,
          ]);
          const volumeData = data.map((item: StockQuote) => [item.t, item.v]);
          setChartData({ priceData, volumeData });
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchData();
  }, [searchQuery]);

  const options = useMemo(
    () => ({
      rangeSelector: {
        selected: 2,
      },
      title: {
        text: searchQuery + " Historical",
      },
      subtitle: {
        text: "With SMA and Volume by Price technical indicators",
      },
      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: "right",
            x: -3,
          },
          title: {
            text: "OHLC",
          },
          height: "60%",
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: "right",
            x: -3,
          },
          title: {
            text: "Volume",
          },
          top: "65%",
          height: "35%",
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },
      plotOptions: {
        series: {
          dataGrouping: {
            units: groupingUnits,
          },
        },
      },
      series: [
        {
          type: "candlestick",
          name: searchQuery,
          id: searchQuery,
          data: chartData.priceData,
          zIndex: 2,
        },
        {
          type: "column",
          name: "Volume",
          id: "volume",
          data: chartData.volumeData,
          yAxis: 1,
        },
        {
          type: "vbp",
          linkedTo: searchQuery,
          params: {
            volumeSeriesID: "volume",
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: "sma",
          linkedTo: searchQuery,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
    }),
    [chartData.priceData, chartData.volumeData]
  );

  /* ************************* */
  /* ************************* */
  /* **************************/
  /* ******Tab4 Chart 1区域****** */
  /* ************************* */
  /* ************************* */
  /* ************************* */

  const [recommendationTrends, setRecommendationTrends] = useState<
    CompanyRecommendationTrend[]
  >([]);

  useEffect(() => {
    const fetchRecommendationTrends = async () => {
      if (searchQuery) {
        const trends = await getRecommendationTrends(searchQuery);
        setRecommendationTrends(trends);
      }
    };

    fetchRecommendationTrends();
  }, [searchQuery]);

  const recommendationChartOptions = useMemo(() => {
    // Transforming the fetched data for Highcharts
    const categories = recommendationTrends.map((trend) => {
      const [year, month] = trend.period.split("-");
      return `${year}-${month}`; // 只保留年份和月份
    });
    const series = [
      {
        name: "Strong Buy",
        data: recommendationTrends.map((trend) => trend.strongBuy),
        color: "#008000",
      },
      {
        name: "Buy",
        data: recommendationTrends.map((trend) => trend.buy),
        color: "#00cc66",
      },
      {
        name: "Hold",
        data: recommendationTrends.map((trend) => trend.hold),
        color: "#cc9900",
      },
      {
        name: "Sell",
        data: recommendationTrends.map((trend) => trend.sell),
        color: "#ff6666",
      },
      {
        name: "Strong Sell",
        data: recommendationTrends.map((trend) => trend.strongSell),
        color: "#663300",
      },
    ];

    return {
      chart: {
        type: "column",
        backgroundColor: "WhiteSmoke",
        marginBottom: 80,
        height: 280,
        reflow: true,
      },
      title: {
        text: "Recommendation Trends",
        align: "center",
        style: {
          fontSize: "15px",
        },
      },
      xAxis: {
        categories: categories,
        labels: {
          style: {
            fontSize: "10px", // 设置 x 轴标签的字体大小
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "#Analysis",
          style: {
            fontSize: "10px", // 你可以按照需要来调整大小
          },
        },

        stackLabels: {
          enabled: true,
        },
        tickInterval: 10, // 根据数据范围选择合适的间隔值
        endOnTick: true,
      },
      legend: {
        align: "center",
        x: 10,
        verticalAlign: "bottom",
        y: 0,
        floating: true,
        shadow: false,
        itemStyle: {
          fontSize: "10px",
        },
      },
      tooltip: {
        headerFormat: "<b>{point.x}</b><br/>",
        pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
      },
      plotOptions: {
        column: {
          stacking: "normal", // 启用堆叠效果
          dataLabels: {
            enabled: true, // 启用数据标签
          },
        },
      },
      series: series,
    };
  }, [recommendationTrends]);

  /* ************************* */
  /* ************************* */
  /* **************************/
  /* ******Tab4 Chart 2区域****** */
  /* ************************* */
  /* ************************* */
  /* ************************* */

  const [earningsData, setEarningsData] = useState<CompanyEarnings[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery) {
        const data = await getCompanyEarnings(searchQuery); // 这假设searchQuery包含了公司的股票代码
        setEarningsData(data);
      }
    };

    fetchData();
  }, [searchQuery]); // 依赖项是searchQuery，确保当它变化时重新获取数据

  const earningsChartOptions = useMemo(() => {
    // const categories = earningsData.map((data) => data.period);
    const categoriesWithSurprise = earningsData.map((data) => {
      const surprise = (data.actual - data.estimate).toFixed(4);
      return `${data.period}<br>Surprise: ${surprise}`;
    });
    const actualData = earningsData.map((data) => data.actual);
    const estimateData = earningsData.map((data) => data.estimate);
    const surpriseData = earningsData.map((data) => ({
      y: data.actual,
      surprise: (data.actual - data.estimate).toFixed(4),
    }));

    return {
      chart: {
        type: "spline",
        backgroundColor: "WhiteSmoke",
        height: 280,
        reflow: true,
      },
      title: {
        text: "Historical EPS Surprises",
        align: "center",
        style: {
          fontSize: "15px",
        },
      },
      xAxis: {
        categories: categoriesWithSurprise,
        labels: {
          style: {
            fontSize: "10px",
            whiteSpace: "nowrap",
          },
        },
      },
      yAxis: {
        title: {
          text: "Querterly EPS",
          style: {
            fontSize: "10px",
          },
        },
        tickInterval: 0.25,
        endOnTick: true,
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      legend: {
        itemStyle: {
          fontSize: "10px",
        },
      },
      tooltip: {
        headerFormat: "<b>{series.name}</b><br>",
        pointFormat: "{point.x}: {point.y}",
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: true,
          },
        },
      },
      series: [
        {
          name: "Actual",
          data: actualData,
          color: "#33adff",
        },
        {
          name: "Estimated",
          data: estimateData,
          color: "#3333cc",
        },
      ],
    };
  }, [earningsData, searchQuery]);

  /* ********* */
  /* *判断market是否open* */
  /* ********* */
  const [marketStatus, setMarketStatus] = useState<{
    isOpen: boolean;
    timestamp: number | null;
  }>({ isOpen: false, timestamp: null });

  const checkMarketStatus = (stockQuote: StockQuote) => {
    const currentTime = Date.now(); // Current time in milliseconds
    const lastUpdateTime = stockQuote.t * 1000; // Convert the 't' value to milliseconds
    const fiveMinutes = 5 * 60 * 1000; // Five minutes in milliseconds

    if (currentTime - lastUpdateTime <= fiveMinutes) {
      setMarketStatus({ isOpen: true, timestamp: stockQuote.t });
    } else {
      setMarketStatus({ isOpen: false, timestamp: stockQuote.t });
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  /* ************************* */
  /* ************************* */
  /* **************************/
  /* ******Tab1 Chart区域****** */
  /* ************************* */
  /* ************************* */
  /* ************************* */

  const [chartData2, setChartData2] = useState({ priceData: [] });
  const [isLoading2, setIsLoading2] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) {
        return;
      }

      const stockQuote = await getStockQuote(searchQuery);
      checkMarketStatus(stockQuote);

      if (marketStatus.timestamp === null) {
        setIsLoading2(false);
        return;
      }

      let to, from;

      if (marketStatus.isOpen) {
        to = new Date(marketStatus.timestamp * 1000);
        from = new Date(marketStatus.timestamp * 1000);
        from.setHours(to.getHours() - 12);
      } else {
        if (stockQuote) {
          to = new Date(stockQuote.t * 1000);
          from = new Date(stockQuote.t * 1000);
          from.setHours(to.getHours() - 12);
        } else {
          // Handle the case when stock quote is not available
          setIsLoading2(false);
          return;
        }
      }

      const fromDateString = from.toISOString().split("T")[0];
      const toDateString = to.toISOString().split("T")[0];
      console.log(fromDateString);
      console.log(toDateString);

      const apiKey = "aiyZqSXaXGsuupDXfFkaWeUEyMO6ooZU";
      const ticker = searchQuery;
      const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/hour/${fromDateString}/${toDateString}?adjusted=true&sort=asc&apiKey=${apiKey}`;
      try {
        const response = await axios.get(url);
        console.log(url);
        if (response.data && response.data.results) {
          const data = response.data.results || [];
          const priceData = data.map((item: any) => [item.t, item.c]); // 假设 item.t 是UNIX时间戳(秒)，并且我们使用收盘价 c
          console.log("Transformed Data:", priceData);
          setChartData2({ priceData });
          console.log("Updated State:", chartData2);
          console.log("API Data:", response.data.results);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
      setIsLoading2(false);
    };
    fetchData();
  }, [searchQuery]);

  Highcharts.setOptions({
    global: {
      useUTC: true,
    },
  });

  const options2 = useMemo(
    () => ({
      chart: {
        backgroundColor: "WhiteSmoke",
        height: 300,
      },
      rangeSelector: {
        selected: 1,
      },
      title: {
        text: searchQuery + " Hourly Price Variation",
        style: {
          fontSize: "14px", // 设置标题大小
          color: "grey", // 设置标题颜色
          fontWeight: "500",
        },
      },
      xAxis: {
        title: {
          text: undefined,
        },
        type: "datetime",
        labels: {
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject
          ) {
            // const valueAsNumber = Number(this.value);
            // const date = new Date(valueAsNumber);
            const date = new Date(this.value);
            // const offset = date.getTimezoneOffset();
            // date.setMinutes(date.getMinutes() - offset);
            return date.getUTCHours() === 0 && date.getUTCMinutes() === 0
              ? Highcharts.dateFormat("%d %b", date.getTime())
              : Highcharts.dateFormat("%H:%M", date.getTime());
          },
        },
      },
      yAxis: {
        opposite: true,
        title: {
          text: undefined,
        },
      },
      series: [
        {
          name: `${searchQuery} Stock Price`,
          data: chartData2.priceData,
          type: "line",
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false,
          },
        },
      },
    }),
    [chartData2.priceData, searchQuery]
  );

  console.log(chartData2.priceData);

  /* ********* */
  /* *收藏功能* */
  /* ********* */
  interface WatchlistItem {
    companyProfile: CompanyProfile;
    stockQuote: StockQuote;
  }

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [showAddedToWatchlistMessage, setShowAddedToWatchlistMessage] =
    useState(false);

  const navigateToSearchWithCompany = async (tickerSymbol: string) => {
    localStorage.setItem("selectedTicker", tickerSymbol);
    setAutocompleteResults([]);
    setSearchQuery(tickerSymbol);
    setSelectedSection("search");

    await triggerSearchDirectly(tickerSymbol);
  };

  const addToWatchlist = (company: CompanyProfile, stockInfo: StockQuote) => {
    setWatchlist((prevWatchlist) => {
      const isPresent = prevWatchlist.some(
        (item) => item.companyProfile.ticker === company.ticker
      );
      if (!isPresent) {
        const updatedWatchlist = [
          ...prevWatchlist,
          { companyProfile: company, stockQuote: stockInfo },
        ];
        localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist)); // Save to localStorage
        return updatedWatchlist;
      }
      return prevWatchlist;
    });
    setShowAddedToWatchlistMessage(true);
    setTimeout(() => setShowAddedToWatchlistMessage(false), 5000);
  };

  const removeFromWatchlist = (tickerSymbol: string) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.filter(
        (item) => item.companyProfile.ticker !== tickerSymbol
      )
    );
  };

  const triggerSearchDirectly = async (query: string) => {
    if (!query) return;

    try {
      const profile = await getCompanyProfile(query);
      setCompanyProfile(profile);
      setAutocompleteResults([]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  /* ********* */
  /* *profile功能* */
  /* ********* */
  interface PortfolioItem {
    companyProfile: CompanyProfile;
    stockQuote: StockQuote;
    quantity: number;
    totalCost: number;
  }

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  const addToPortfolio = (newItem: PortfolioItem) => {
    const updatedPortfolio = [...portfolio, newItem];
    setPortfolio(updatedPortfolio);
    localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
  };

  /* ********* */
  /* *insider sentiment功能* */
  /* ********* */

  const [insiderSentiment, setInsiderSentiment] = useState<InsiderSentiment[]>(
    []
  );
  const [totalChange, setTotalChange] = useState<number>(0);
  const [totalPositiveChange, setTotalPositiveChange] = useState<number>(0);
  const [totalNegativeChange, setTotalNegativeChange] = useState<number>(0);

  const [totalPositiveMSPR, setTotalPositiveMSPR] = useState<number>(0);
  const [totalNegativeMSPR, setTotalNegativeMSPR] = useState<number>(0);
  const [totalMSPR, setTotalMSPR] = useState<number>(0);

  useEffect(() => {
    if (activeTab === "tab4" && companyProfile) {
      const fetchSentiment = async () => {
        try {
          const sentimentData = await fetchInsiderSentiment(
            companyProfile.ticker, // use the currently selected company's ticker
            "2022-01-01",
            "2022-12-31"
          );
          setInsiderSentiment(sentimentData);

          // Calculate the total change
          const totalPositiveChange = sentimentData
            .filter((data) => data.change > 0)
            .reduce((acc, data) => acc + data.change, 0);
          const totalNegativeChange = sentimentData
            .filter((data) => data.change < 0)
            .reduce((acc, data) => acc + data.change, 0);
          const total = totalPositiveChange + totalNegativeChange;

          setTotalChange(total);
          setTotalPositiveChange(totalPositiveChange);
          setTotalNegativeChange(totalNegativeChange);

          let positiveMSPRTotal = 0;
          let negativeMSPRTotal = 0;
          let msprTotal = 0;

          sentimentData.forEach((item) => {
            const mspr = item.mspr || 0;
            msprTotal += mspr;
            if (mspr > 0) {
              positiveMSPRTotal += mspr;
            } else if (mspr < 0) {
              negativeMSPRTotal += mspr;
            }
          });

          setTotalPositiveMSPR(positiveMSPRTotal);
          setTotalNegativeMSPR(negativeMSPRTotal);
          setTotalMSPR(msprTotal);
        } catch (error) {
          console.error("Error fetching insider sentiment data:", error);
        }
      };

      fetchSentiment();
    }
  }, [activeTab, companyProfile]);

  /* ********* */
  /* *peer功能* */
  /* ********* */

  const [peers, setPeers] = useState<string[]>([]);

  useEffect(() => {
    if (searchQuery) {
      getCompanyPeers(searchQuery).then(setPeers).catch(console.error);
      fetchCompanyNews(searchQuery);
    }
  }, [searchQuery]);

  const handlePeerSearch = async (peerTicker: string) => {
    handleAutocompleteItemClick(peerTicker);
    setSearchQuery(peerTicker);
    setSelectedSection("search");

    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    const toDate = new Date();

    const fromDateString = fromDate.toISOString().split("T")[0];
    const toDateString = toDate.toISOString().split("T")[0];

    try {
      const profile = await getCompanyProfile(peerTicker);
      setCompanyProfile(profile);

      const quote = await getStockQuote(peerTicker);
      setStockQuote(quote);
      checkMarketStatus(quote);

      const news = await getCompanyNews(
        peerTicker,
        fromDateString,
        toDateString
      );

      setCompanyNews(
        news
          .filter((item) => item.image && !item.image.includes("yahoo"))
          .slice(0, 20)
      );
    } catch (error) {
      console.error("Failed to fetch peer data:", error);
    }
  };

  /* 页面spinner效果 */
  const [isFullPageLoading, setIsFullPageLoading] = useState(false);
  const [isFullPageLoading2, setIsFullPageLoading2] = useState(false);

  /* 搜索页面点击下拉菜单之后的的spinner效果 */
  const handleAutocompleteItemClick = async (symbol: string) => {
    // 显示全页加载指示器
    setIsFullPageLoading(true);

    // 延时两秒加载数据
    setTimeout(async () => {
      try {
        const profile = await getCompanyProfile(symbol);
        setCompanyProfile(profile);
      } catch (error) {
        console.error("Failed to fetch company profile:", error);
      } finally {
        setIsFullPageLoading(false);
      }
    }, 2000);
  };

  /* watchlist页面的spinner效果 */
  const handleWatchlistClick = () => {
    setIsFullPageLoading2(true); // 显示 spinner
    setSelectedSection("watchlist");
    setTimeout(() => {
      setIsFullPageLoading2(false); // 2秒后隐藏 spinner
    }, 2000);
  };

  /* portfolio页面的spinner效果 */
  const handlePortfolioClick = () => {
    setIsFullPageLoading2(true); // 显示 spinner
    setSelectedSection("portfolio");
    setTimeout(() => {
      setIsFullPageLoading2(false); // 2秒后隐藏 spinner
    }, 2000);
  };

  useEffect(() => {
    if (selectedSection === "search") {
      const selectedTicker = localStorage.getItem("selectedTicker");
      if (selectedTicker) {
        handleAutocompleteItemClick(selectedTicker).finally(() => {
          setAutocompleteResults([]); // 确保这是最后执行的
          localStorage.removeItem("selectedTicker"); // 清除localStorage中的ticker
        });
      }
    }
  }, [selectedSection, handleAutocompleteItemClick]);

  /* 字体大小 */
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const titleStyle = {
    fontSize: windowWidth <= 390 ? "36px" : "26px",
  };

  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* return函数 */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */
  /* ************************ */

  return (
    <>
      <div>
        <Search
          items={items}
          selected={selectedSection}
          heading="Stock Search"
          onSelect={handleSelection}
        />
      </div>

      <div className="d-flex flex-column min-vh-100 row align-items-center">
        <div className="col-lg-8">
          {selectedSection === "search" && (
            <>
              <div
                id="search"
                className="search-container position-relative text-center"
              >
                <h2 className="search-title mt-5 fw-light" style={titleStyle}>
                  STOCK SEARCH
                </h2>
                <div className="search-box mt-3 col-lg-4 col-8">
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Enter stock ticker symbol"
                    value={searchQuery}
                    onChange={handleInputChange}
                  />
                  <button
                    className="search-button"
                    onClick={() => handleSearch3(searchQuery)}
                  >
                    <i
                      className="bi bi-search"
                      style={{ color: "#1d279d" }}
                    ></i>
                  </button>
                  <button className="search-button" onClick={clearSearch}>
                    <i
                      className="bi bi-x"
                      style={{ fontSize: "1.5rem", color: "#1d279d" }}
                    ></i>
                  </button>
                </div>
                {autocompleteResults.length > 0 &&
                  (isLoading ? (
                    <div className="autocomplete-dropdown position-absolute w-20">
                      <div className="d-flex justify-content-left py-2">
                        <div
                          className="spinner-border text-primary ms-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="autocomplete-dropdown position-absolute w-20">
                      {autocompleteResults.map((result, index) => (
                        <div
                          key={index}
                          role="button"
                          className="autocomplete-item px-2 py-2 d-flex justify-content-start text-nowrap"
                          style={{ fontSize: "12px" }}
                          onClick={async () => {
                            setIsLoading(true);
                            setSearchQuery(result.symbol);
                            setAutocompleteResults([]);
                            handleAutocompleteItemClick(result.symbol);
                            handleDropdownSelection(result.symbol);
                            try {
                              const profile = await getCompanyProfile(
                                result.symbol
                              );
                              const quote = await getStockQuote(result.symbol); // 获取股票实时报价
                              const fromDate = new Date();
                              fromDate.setFullYear(fromDate.getFullYear() - 1); // 从一年前开始
                              const toDate = new Date(); // 直到当前日期
                              // 将日期格式化为 YYYY-MM-DD 格式
                              const fromDateString = fromDate
                                .toISOString()
                                .split("T")[0];
                              const toDateString = toDate
                                .toISOString()
                                .split("T")[0];
                              const news = await getCompanyNews(
                                result.symbol,
                                fromDateString,
                                toDateString
                              );
                              setCompanyProfile(profile); // 更新公司详细信息状态
                              setStockQuote(quote); // 保存报价信息
                              checkMarketStatus(quote);
                              setActiveTab("tab1");
                              setCompanyNews(
                                news
                                  .filter(
                                    (item) =>
                                      item.image &&
                                      !item.image.includes("yahoo")
                                  )
                                  .slice(0, 20)
                              );
                            } catch (error) {
                              console.error(
                                "Failed to fetch company profile:",
                                error
                              );
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          {result.symbol} | {result.description}
                        </div>
                      ))}
                    </div>
                  ))}
              </div>

              {isFullPageLoading ? (
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <CircularProgress />
                </div>
              ) : (
                <>
                  {showAddedToWatchlistMessage && (
                    <>
                      <div
                        className="alert alert-success mx-auto py-1 d-flex justify-content-between align-items-center"
                        role="alert"
                        style={{
                          textAlign: "center",
                          marginTop: "20px",
                          maxWidth: "1000px",
                          fontSize: "13px",
                        }}
                      >
                        <div className="text-center flex-grow-1">
                          {companyProfile?.ticker} added to Watchlist.
                        </div>
                        <i
                          className="bi bi-x fs-3"
                          onClick={() => setShowAddedToWatchlistMessage(false)}
                        ></i>
                      </div>
                    </>
                  )}
                  {showPurchaseSuccess && (
                    <>
                      <div
                        className="alert alert-success mx-auto py-1 d-flex justify-content-between align-items-center"
                        role="alert"
                        style={{
                          textAlign: "center",
                          marginTop: "20px",
                          maxWidth: "1000px",
                          fontSize: "13px",
                        }}
                      >
                        <div className="text-center flex-grow-1">
                          {purchaseMessage}
                        </div>

                        <i
                          className="bi bi-x fs-3 text-muted"
                          onClick={() => setShowPurchaseSuccess(false)}
                        ></i>
                      </div>
                    </>
                  )}
                  {showSellSuccess && (
                    <>
                      <div
                        className="alert alert-danger mx-auto py-1 d-flex justify-content-between align-items-center"
                        role="alert"
                        style={{
                          textAlign: "center",
                          marginTop: "20px",
                          maxWidth: "1000px",
                          fontSize: "13px",
                        }}
                      >
                        <div className="text-center flex-grow-1">
                          {sellMessage}
                        </div>
                        <i
                          className="bi bi-x fs-3 text-muted"
                          onClick={() => setShowSellSuccess(false)}
                        ></i>
                      </div>
                    </>
                  )}
                  {showNoDataMessage && (
                    <>
                      <div
                        className="alert alert-danger mx-auto py-1 d-flex justify-content-between align-items-center"
                        role="alert"
                        style={{
                          textAlign: "center",
                          marginTop: "20px",
                          maxWidth: "1000px",
                          fontSize: "13px",
                          height: "50px",
                        }}
                      >
                        <div className="text-center flex-grow-1">
                          No data found. Please enter a valid Ticker.
                        </div>
                      </div>
                    </>
                  )}

                  <div className="top-three row  align-items-center mt-4">
                    {companyProfile && stockQuote && (
                      <>
                        <div className="top-three1 col-4 d-flex flex-column justify-content-center align-items-center mb-4">
                          <div className="d-flex">
                            <h2>{companyProfile.ticker}</h2>
                            <i
                              className={`bi bi-star${
                                watchlist.some(
                                  (item) =>
                                    item.companyProfile.ticker ===
                                    companyProfile?.ticker
                                )
                                  ? "-fill text-warning"
                                  : ""
                              }`}
                              style={{ marginTop: "4px" }}
                              onClick={() =>
                                addToWatchlist(companyProfile, stockQuote)
                              }
                            ></i>
                          </div>
                          <h5
                            className="text-secondary"
                            style={{
                              letterSpacing: "0.03em",
                              marginRight: "5px",
                            }}
                          >
                            {companyProfile.name}
                          </h5>
                          <h6
                            className="text-nowrap fw-light"
                            style={{
                              fontSize: "0.75rem",
                              letterSpacing: "-0.05em",
                            }}
                          >
                            {companyProfile.exchange}
                          </h6>
                          <div className="d-flex">
                            <button
                              type="button"
                              className="btn btn-success btn-sm me-2"
                              onClick={() =>
                                openBuyModal(currentStockAsPortfolioItem)
                              }
                            >
                              Buy
                            </button>
                            <BuyModal
                              isOpen={isBuyModalOpen}
                              onClose={closeBuyModal}
                              onConfirmBuy={handleConfirmBuy}
                              currentPrice={stockQuote?.c || 0}
                              moneyInWallet={moneyInWallet}
                              currentStock={companyProfile.ticker}
                            />
                            {moneyInWallet < 25000 && (
                              <>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={openSellModal2}
                                >
                                  Sell
                                </button>
                                <SellModal
                                  isOpen={isSellModalOpen}
                                  onClose={closeSellModal}
                                  onConfirmSell={handleConfirmSell}
                                  currentPrice={stockQuote?.c || 0}
                                  moneyInWallet={moneyInWallet}
                                  currentStock={companyProfile?.ticker || ""}
                                  availableShares={
                                    portfolio.find(
                                      (item) =>
                                        item.companyProfile.ticker ===
                                        companyProfile?.ticker
                                    )?.quantity || 0
                                  }
                                />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="top-three2 col-4 d-flex flex-column justify-content-center align-items-center gap-4">
                          <img
                            src={companyProfile.logo}
                            alt={`${companyProfile.name} logo`}
                            className="img-fluid"
                            style={{ maxWidth: "80px", height: "auto" }}
                          />
                          {marketStatus.timestamp !== null && (
                            <div
                              style={{
                                color: marketStatus.isOpen ? "green" : "red",
                                textAlign: "center",
                                fontSize: "12px",
                              }}
                              className="mt-4"
                            >
                              {marketStatus.isOpen
                                ? "Market is Open"
                                : `Market Closed on ${
                                    marketStatus.timestamp
                                      ? formatDate(
                                          marketStatus.timestamp * 1000
                                        )
                                      : "N/A"
                                  }`}
                            </div>
                          )}
                        </div>
                        <div className="top-three3 col-4 d-flex flex-column justify-content-center align-items-center mb-4">
                          <p
                            className={
                              (stockQuote?.d || 0) > 0
                                ? "price-up"
                                : "price-down"
                            }
                            style={{ fontSize: "1.75rem" }}
                          >
                            {stockQuote?.c}
                          </p>
                          <div
                            className="d-flex text-nowrap"
                            style={{ gap: "10px" }}
                          >
                            <i
                              className={
                                (stockQuote?.d || 0) > 0
                                  ? "bi bi-caret-up-fill upArror"
                                  : "bi bi-caret-down-fill downArror"
                              }
                              style={{ marginTop: "-18px" }}
                            ></i>
                            <p
                              className={
                                (stockQuote?.d || 0) > 0
                                  ? "price-up"
                                  : "price-down"
                              }
                              style={{
                                fontSize: "1.25rem",
                                marginBottom: "5px",
                                marginTop: "-20px",
                              }}
                            >
                              {stockQuote?.d} (
                              {(stockQuote?.dp || 0).toFixed(2)}
                              %)
                            </p>
                          </div>
                          <p
                            className="text-nowrap"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <CurrentTimeDisplay />
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {companyProfile && (
                    <div>
                      <div>
                        <div className="text-center row justify-content-center align-items-center mt-4">
                          <button
                            className={`tab-btn ${
                              activeTab === "tab1" ? "active col-3" : "col-3"
                            }`}
                            onClick={() => handleTabClick("tab1")}
                          >
                            Summary
                          </button>
                          <button
                            className={`tab-btn ${
                              activeTab === "tab2" ? "active col-3" : "col-3"
                            }`}
                            onClick={() => handleTabClick("tab2")}
                          >
                            Top News
                          </button>
                          <button
                            className={`tab-btn ${
                              activeTab === "tab3" ? "active col-3" : "col-3"
                            }`}
                            onClick={() => handleTabClick("tab3")}
                          >
                            Charts
                          </button>
                          <button
                            className={`tab-btn ${
                              activeTab === "tab4" ? "active col-3" : "col-3"
                            }`}
                            onClick={() => handleTabClick("tab4")}
                          >
                            Insights
                          </button>
                        </div>
                      </div>
                      {activeTab && (
                        <div className="tab-content mb-4">
                          {activeTab === "tab1" && (
                            <div className="d-flex justify-content-between align-items-center row">
                              <div
                                id="summary-left"
                                className="d-flex flex-column align-items-center col-lg-4 col-sm-12 me-5 pb-4 text-nowrap"
                              >
                                <div
                                  id="company-price"
                                  className="row justify-content-between align-items-center mb-3 text-center"
                                >
                                  <div className="col-4">
                                    <div
                                      className="mt-3 col-6"
                                      style={{ fontSize: "12px" }}
                                    >
                                      <div>
                                        <b>High Price:</b> {stockQuote?.h}
                                      </div>
                                      <div>
                                        <b>Low Price:</b> {stockQuote?.l}
                                      </div>
                                      <div>
                                        <b>Open Price:</b> {stockQuote?.o}
                                      </div>
                                      <div>
                                        <b>Prev. Close:</b> {stockQuote?.pc}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div id="company-info">
                                  <div>
                                    <div
                                      style={{
                                        borderBottom: "1px solid",
                                        lineHeight: "0.8",
                                        display: "inline-block",
                                      }}
                                    >
                                      About the company
                                    </div>
                                    <div
                                      className="mt-3"
                                      style={{ fontSize: "11px" }}
                                    >
                                      <b>IPO Start Date:</b>{" "}
                                      {companyProfile?.ipo}
                                    </div>
                                    <div
                                      className="mt-2"
                                      style={{ fontSize: "11px" }}
                                    >
                                      <b>Industry:</b>{" "}
                                      {companyProfile?.finnhubIndustry}
                                    </div>
                                    <div
                                      className="mt-2"
                                      style={{ fontSize: "11px" }}
                                    >
                                      <b>Webpage:</b>{" "}
                                      <a href={companyProfile?.weburl}>
                                        {companyProfile?.weburl}
                                      </a>
                                    </div>
                                    <div
                                      className="mt-2"
                                      style={{ fontSize: "11px" }}
                                    >
                                      <b>Company peers:</b>{" "}
                                    </div>
                                  </div>

                                  {isFullPageLoading ? (
                                    <div
                                      style={{
                                        position: "fixed",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                      }}
                                    >
                                      <CircularProgress />
                                    </div>
                                  ) : (
                                    <div
                                      className="mt-2"
                                      style={{ fontSize: "11px" }}
                                    >
                                      {peers.map((peerTicker) => (
                                        <span>
                                          <a
                                            key={peerTicker}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handlePeerSearch(peerTicker);
                                            }}
                                            href="#"
                                            className="peer-link"
                                          >
                                            {peerTicker},
                                          </a>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div
                                id="summary-right"
                                className="col-lg-6 col-sm-12 d-flex justify-content-center"
                              >
                                <div className="col-10">
                                  <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options2}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {activeTab === "tab2" && (
                            <div>
                              <div className="news-grid row g-3 mx-3">
                                {companyNews.map((news, index) => (
                                  <div
                                    key={index}
                                    className="col-12 col-lg-6"
                                    onClick={() => handleNewsClick(news)}
                                  >
                                    <div className="news-item rounded pointer align-items-center bg-white border rounded overflow-hidden d-flex flex-column flex-lg-row p-2">
                                      <img
                                        src={news.image}
                                        alt="News"
                                        className="news-imageL rounded img-fluid d-lg-none pt-2"
                                      />
                                      <img
                                        src={news.image}
                                        alt="News"
                                        className="news-imageS rounded img-fluid d-none d-lg-block" // 在小屏幕上隐藏，在大屏幕上显示
                                      />
                                      <div className="news-text mt-2 mt-lg-0">
                                        {" "}
                                        <p
                                          style={{
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 2,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            fontSize: "12px",
                                          }}
                                        >
                                          {news.headline}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <NewsModal
                                show={showModal}
                                onClose={handleCloseModal}
                                newsItem={currentNews}
                              />
                            </div>
                          )}
                          {activeTab === "tab3" && (
                            <div
                              className="h-800 d-flex justify-content-center align-items-center"
                              style={{ height: "500px", marginTop: "-20px" }}
                            >
                              <HighchartsReact
                                highcharts={Highcharts}
                                constructorType={"stockChart"}
                                options={{
                                  ...options,
                                  chart: {
                                    backgroundColor: "WhiteSmoke", // 设置图表的背景色
                                  },
                                }}
                                containerProps={{
                                  style: { width: "100%", height: "100%" },
                                }}
                              />
                            </div>
                          )}
                          {activeTab === "tab4" && (
                            <>
                              <div>
                                <div className="container d-flex justify-content-center">
                                  <div className="col-lg-6 col-sm-12 text-nowrap">
                                    <p className="fw-medium fs-5 text-center mb-3">
                                      Insider Sentiments
                                    </p>
                                    <div
                                      className="row border-bottom py-2"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {insiderSentiment.length > 0 && (
                                        <div className="col text-center">
                                          <strong>
                                            {companyProfile?.name}
                                          </strong>
                                        </div>
                                      )}
                                      <div className="col text-center">
                                        <strong>MSPR</strong>
                                      </div>
                                      <div className="col text-center">
                                        <strong>Change</strong>
                                      </div>
                                    </div>
                                    <div
                                      className="row border-bottom py-2"
                                      style={{ fontSize: "12px" }}
                                    >
                                      <div className="col text-center">
                                        <strong>Total</strong>
                                      </div>
                                      <div className="col text-center">
                                        {totalMSPR.toFixed(2)}
                                      </div>
                                      <div className="col text-center">
                                        {totalChange}
                                      </div>
                                    </div>
                                    <div
                                      className="row border-bottom py-2"
                                      style={{ fontSize: "12px" }}
                                    >
                                      <div className="col text-center">
                                        <strong>Positive</strong>
                                      </div>
                                      <div className="col text-center">
                                        {totalPositiveMSPR.toFixed(2)}
                                      </div>
                                      <div className="col text-center">
                                        {totalPositiveChange}
                                      </div>
                                    </div>
                                    <div
                                      className="row border-bottom py-2"
                                      style={{ fontSize: "12px" }}
                                    >
                                      <div className="col text-center">
                                        <strong>Negative</strong>
                                      </div>
                                      <div className="col text-center">
                                        {totalNegativeMSPR.toFixed(2)}
                                      </div>
                                      <div className="col text-center">
                                        {totalNegativeChange}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-center mt-4 row">
                                  <div className="col-sm-12 col-md-8 col-lg-6">
                                    {searchQuery && (
                                      <HighchartsReact
                                        highcharts={Highcharts}
                                        options={recommendationChartOptions}
                                      />
                                    )}
                                  </div>
                                  <div className="col-sm-12 col-md-8 col-lg-6">
                                    {searchQuery && (
                                      <HighchartsReact
                                        highcharts={Highcharts}
                                        options={earningsChartOptions}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
          {selectedSection === "watchlist" && (
            <>
              <div id="watchlist">
                <div className="justify-content-center container mx-lg-5 mx-md-5 my-3 d-flex">
                  <div className="d-flex justify-content-center row w-100">
                    <div className="col-12">
                      <div className="my-4">
                        <h3 className="text-start">My Watchlist</h3>
                      </div>

                      {isFullPageLoading2 ? (
                        <div
                          style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <CircularProgress />
                        </div>
                      ) : (
                        <>
                          {watchlist.length > 0 ? (
                            <div>
                              {watchlist.map((item, index) => (
                                <div
                                  key={index}
                                  className="watchlist-item ps-2 mt-3"
                                  onClick={() =>
                                    navigateToSearchWithCompany(
                                      item.companyProfile.ticker
                                    )
                                  }
                                  style={{
                                    cursor: "pointer",
                                    border: "1px solid LightGray",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <i
                                    className="bi bi-x"
                                    style={{ fontSize: "0.7rem" }}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      removeFromWatchlist(
                                        item.companyProfile.ticker
                                      );
                                    }}
                                  ></i>
                                  <div className="text-nowrap row">
                                    <div className="col-lg-4 col-4">
                                      <p className="fs-4 fw-medium mb-1">
                                        {item.companyProfile.ticker}
                                      </p>
                                      <p>{item.companyProfile.name}</p>
                                    </div>
                                    <div className="col-lg-5 col-8 d-flex flex-column align-items-center">
                                      <p
                                        className={
                                          item.stockQuote?.d > 0
                                            ? "price-up"
                                            : item.stockQuote?.d < 0
                                            ? "price-down"
                                            : ""
                                        }
                                        style={{ fontSize: "1.5rem" }}
                                      >
                                        {(item.stockQuote?.c || 0).toFixed(2)}
                                      </p>
                                      <div
                                        className="d-flex mt-2"
                                        style={{ gap: "5px" }}
                                      >
                                        <i
                                          className={
                                            item.stockQuote?.d > 0
                                              ? "bi bi-caret-up-fill upArror ms-5"
                                              : item.stockQuote?.d < 0
                                              ? "bi bi-caret-down-fill downArror ms-5"
                                              : ""
                                          }
                                          style={{
                                            marginTop: "-15px",
                                            fontSize: "0.75rem",
                                          }}
                                        ></i>
                                        <p
                                          className={
                                            item.stockQuote?.d > 0
                                              ? "price-up"
                                              : item.stockQuote?.d < 0
                                              ? "price-down"
                                              : ""
                                          }
                                          style={{
                                            fontSize: "1rem",
                                            marginBottom: "5px",
                                            marginTop: "-20px",
                                          }}
                                        >
                                          {(item.stockQuote?.d).toFixed(2)} (
                                          {(item.stockQuote?.dp).toFixed(2)}
                                          %)
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div
                              className="d-flex justify-content-center align-items-center border-1 rounded"
                              style={{
                                backgroundColor: "#FFEDC2",
                                opacity: 0.9,
                                border: "1px solid #FFEDC2",
                                fontSize: "14px",
                              }}
                            >
                              <p className="m-2 text-center">
                                Currently you don't have any stock in your
                                watchlist.
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {selectedSection === "portfolio" && (
            <>
              <div
                id="portfolio"
                className="justify-content-center container my-3 d-flex"
              >
                <div className="d-flex justify-content-center row w-100">
                  {showPurchaseSuccess && (
                    <>
                      <div
                        className="alert alert-success mx-auto py-1 d-flex justify-content-between align-items-center"
                        role="alert"
                        style={{
                          textAlign: "center",
                          marginTop: "20px",
                          maxWidth: "1000px",
                          fontSize: "13px",
                        }}
                      >
                        <div className="text-center flex-grow-1">
                          {purchaseMessage}
                        </div>

                        <i
                          className="bi bi-x fs-3 text-muted"
                          onClick={() => setShowPurchaseSuccess(false)}
                        ></i>
                      </div>
                    </>
                  )}
                  {showSellSuccess && (
                    <>
                      <div
                        className="alert alert-danger mx-auto py-1 d-flex justify-content-between align-items-center"
                        role="alert"
                        style={{
                          textAlign: "center",
                          marginTop: "20px",
                          maxWidth: "1000px",
                          fontSize: "13px",
                        }}
                      >
                        <div className="text-center flex-grow-1">
                          {sellMessage}
                        </div>
                        <i
                          className="bi bi-x fs-3 text-muted"
                          onClick={() => setShowSellSuccess(false)}
                        ></i>
                      </div>
                    </>
                  )}
                  <div className="col-lg-12 col-md-8 col-sm-6 col-12">
                    <div className="my-4">
                      <h3 className="text-start">My Portfolio</h3>
                    </div>
                    {isFullPageLoading2 ? (
                      <div
                        style={{
                          position: "fixed",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <CircularProgress />
                      </div>
                    ) : (
                      <>
                        <p className="text-start">
                          Money in Wallet: ${moneyInWallet.toFixed(2)}
                        </p>{" "}
                        {Object.entries(portfolio).length > 0 ? (
                          Object.entries(portfolio).map(([ticker, item]) => {
                            const avgCostPerShare =
                              item.totalCost / item.quantity;
                            const currentPrice = item.stockQuote.c; // 假设您已经有途径获取当前股票价格
                            const totalCost = item.totalCost;
                            const change = currentPrice - avgCostPerShare;
                            const marketValue = currentPrice * item.quantity;

                            const arrowIcon =
                              change > 0
                                ? "bi bi-caret-up-fill upArror"
                                : change < 0
                                ? "bi bi-caret-down-fill downArror"
                                : "";

                            return (
                              <div
                                key={ticker}
                                className="watchlist-item"
                                style={{
                                  cursor: "pointer",
                                  border: "1px solid LightGray",
                                  borderRadius: "5px",
                                  marginTop: "10px",
                                }}
                              >
                                <div className="d-flex align-items-center position-relative justify-content-left border-bottom bg-light ps-2 mb-3">
                                  <p className="fs-4 fw-medium mb-0">
                                    {item.companyProfile.ticker}
                                  </p>
                                  <p
                                    className="fs-6 ms-2"
                                    style={{
                                      color: "#495057",
                                      top: "10px",
                                      position: "relative",
                                    }}
                                  >
                                    {item.companyProfile.name}
                                  </p>
                                </div>
                                <div
                                  className="d-flex justify-content-between ps-2 row"
                                  style={{ lineHeight: "0.5" }}
                                >
                                  <div className="d-flex row col-lg-6 col-sm-12">
                                    <div className="col-8">
                                      <p>Quantity: </p>
                                      <p>Avg. Cost / Share:</p>
                                      <p>Total Cost:</p>
                                    </div>
                                    <div className="col-4">
                                      <p>{item.quantity.toFixed(2)}</p>
                                      <p>{avgCostPerShare.toFixed(2)}</p>
                                      <p>{totalCost.toFixed(2)}</p>
                                    </div>
                                  </div>
                                  <div className="d-flex row col-lg-6 col-sm-12">
                                    <div className="col-8 col-lg-7">
                                      <p>Change:</p>
                                      <p>Current Price:</p>
                                      <p>Market Value:</p>
                                    </div>
                                    {/* <div className="me-5"> */}
                                    <div className="d-flex row col-4 col-lg-5">
                                      <div className="d-flex">
                                        {arrowIcon && (
                                          <i
                                            className={`${arrowIcon} me-1`}
                                          ></i>
                                        )}
                                        <p
                                          className={
                                            change > 0
                                              ? "price-up"
                                              : change < 0
                                              ? "price-down"
                                              : ""
                                          }
                                        >
                                          {change.toFixed(2)}
                                        </p>
                                      </div>
                                      <p
                                        className={
                                          change > 0
                                            ? "price-up"
                                            : change < 0
                                            ? "price-down"
                                            : ""
                                        }
                                      >
                                        {currentPrice.toFixed(2)}
                                      </p>
                                      <p
                                        className={
                                          change > 0
                                            ? "price-up"
                                            : change < 0
                                            ? "price-down"
                                            : ""
                                        }
                                      >
                                        {marketValue.toFixed(2)}
                                      </p>
                                    </div>
                                    {/* </div> */}
                                  </div>
                                </div>
                                <div
                                  key={item.companyProfile.ticker}
                                  className="d-flex justify-content-left position-relative border-top bg-light ps-2 py-1"
                                >
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => openBuyModal(item)}
                                  >
                                    Buy
                                  </button>
                                  <BuyModal
                                    isOpen={isBuyModalOpen}
                                    onClose={closeBuyModal}
                                    onConfirmBuy={handleConfirmBuy}
                                    currentPrice={
                                      selectedStockForTransaction?.stockQuote
                                        .c || 0
                                    }
                                    moneyInWallet={moneyInWallet}
                                    currentStock={
                                      selectedStockForTransaction
                                        ?.companyProfile.ticker || ""
                                    }
                                  />

                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => openSellModal(item)}
                                  >
                                    Sell
                                  </button>
                                  <SellModal
                                    isOpen={isSellModalOpen}
                                    onClose={closeSellModal}
                                    onConfirmSell={handleConfirmSell}
                                    currentPrice={
                                      selectedStockForTransaction?.stockQuote
                                        .c || 0
                                    }
                                    moneyInWallet={moneyInWallet}
                                    currentStock={
                                      selectedStockForTransaction
                                        ?.companyProfile.ticker || ""
                                    }
                                    availableShares={
                                      selectedStockForTransaction?.quantity || 0
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div
                            className="d-flex justify-content-center align-items-center border-1 rounded"
                            style={{
                              backgroundColor: "#FFEDC2",
                              opacity: 0.9,
                              border: "1px solid #FFEDC2",
                              fontSize: "14px",
                            }}
                          >
                            <p className="m-2 text-center">
                              Your portfolio is currently empty.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <footer className="bg-light text-center mt-auto w-100">
        <div
          className="text-center p-2 fw-semibold"
          style={{ backgroundColor: "LightGray", fontSize: "12px" }}
        >
          Powered by <a href="https://finnhub.io/">Finnhub.io</a>
        </div>
      </footer>
    </>
  );
}

export default App;
