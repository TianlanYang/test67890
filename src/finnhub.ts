// src/finnhubService.ts

import axios from "axios";

const API_KEY = "cn5v9mpr01qo3qc0c6v0cn5v9mpr01qo3qc0c6vg"; // 使用你的 Finnhub API 密钥
const BASE_URL = "https://finnhub.io/api/v1";

/* ************************* */
/* Company’s Description API */
/* ************************* */

export interface CompanyProfile {
  name: string;
  ticker: string;
  logo: string;
  weburl: string;
  exchange: string;
  ipo: string;
  finnhubIndustry: string;
  // 根据 Finnhub API 文档，你可以添加更多的属性
}

export const getCompanyProfile = async (
  symbol: string
): Promise<CompanyProfile> => {
  const response = await axios.get<CompanyProfile>(
    `${BASE_URL}/stock/profile2`,
    {
      params: {
        symbol: symbol,
        token: API_KEY,
      },
    }
  );
  console.log(response.data);
  return response.data;
};

/* **************** */
/* AutoComplete API */
/* **************** */

export interface AutocompleteResult {
  symbol: string;
  description: string;
  // 可以根据 Finnhub API 返回的实际数据结构添加更多属性
}

export const searchSymbols = async (
  query: string
): Promise<AutocompleteResult[]> => {
  console.log("API call with query: ", query);
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      q: query,
      token: API_KEY,
    },
  });

  // 过滤股票类型和包含点号的股票代码
  return response.data.result
    .filter(
      (item: any) =>
        item.type === "Common Stock" &&
        item.symbol.startsWith(query) &&
        !item.symbol.includes(".")
    )
    .map((item: any) => ({
      symbol: item.symbol,
      description: item.description,
    }));
};

/* *********************************** */
/* Company’s Latest Price of Stock API */
/* *********************************** */

export interface StockQuote {
  c: number; // 当前价格
  h: number; // 当天最高价格
  l: number; // 当天最低价格
  o: number; // 当天开盘价格
  pc: number; // 前一交易日收盘价格
  dp: number; //百分比变动
  d: number; //价格变动
  t: number; //current timestamp
  v: number;
}

export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
  const response = await axios.get<StockQuote>(`${BASE_URL}/quote`, {
    params: {
      symbol: symbol,
      token: API_KEY,
    },
  });
  return response.data;
};

/* *********************************** */
/* Company’s News API */
/* *********************************** */

export interface CompanyNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

// 添加获取公司新闻的函数
export const getCompanyNews = async (
  symbol: string,
  from: string,
  to: string
): Promise<CompanyNews[]> => {
  const response = await axios.get<CompanyNews[]>(`${BASE_URL}/company-news`, {
    params: {
      symbol,
      from,
      to,
      token: API_KEY,
    },
  });
  return response.data;
};

/* *********************************** */
/* Company’s Insider Sentiment API */
/* *********************************** */

export interface InsiderSentiment {
  symbol: string;
  year: number;
  month: number;
  change: number;
  mspr: number;
}

export const fetchInsiderSentiment = async (
  symbol: string,
  from: string,
  to: string
): Promise<InsiderSentiment[]> => {
  const response = await axios.get(`${BASE_URL}/stock/insider-sentiment`, {
    params: {
      symbol,
      from,
      to,
      token: API_KEY,
    },
  });
  return response.data.data;
};

/* *********************************** */
/* Company’s Company’s Earnings API */
/* *********************************** */

export interface CompanyEarnings {
  actual: number;
  estimate: number;
  period: string;
  symbol: string;
}

export const getCompanyEarnings = async (
  symbol: string
): Promise<CompanyEarnings[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/stock/earnings`, {
      params: {
        symbol,
        token: API_KEY,
      },
    });

    // Replace null with 0 for actual and estimate
    return response.data.map((earnings: any) => ({
      actual: earnings.actual ?? 0,
      estimate: earnings.estimate ?? 0,
      period: earnings.period,
      symbol: earnings.symbol,
    }));
  } catch (error) {
    console.error("Failed to fetch company earnings:", error);
    return [];
  }
};

/* *********************************** */
/* Company’s Trend API */
/* *********************************** */

export interface CompanyRecommendationTrend {
  period: string;
  buy: number;
  hold: number;
  sell: number;
  strongBuy: number;
  strongSell: number;
}

export const getRecommendationTrends = async (symbol: string): Promise<CompanyRecommendationTrend[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/stock/recommendation`, {
      params: {
        symbol,
        token: API_KEY,
      },
    });

    // 直接返回API的响应数据或转换它以符合你的需要
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recommendation trends:", error);
    return [];
  }
};

/* *********************************** */
/* Company’s Peers API */
/* *********************************** */

export const getCompanyPeers = async (symbol: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/stock/peers`, {
      params: {
        symbol: symbol,
        token: API_KEY,
      },
    });
    return response.data; // Assuming the response data is an array of strings (ticker symbols).
  } catch (error) {
    console.error("Failed to fetch company peers:", error);
    return [];
  }
};

