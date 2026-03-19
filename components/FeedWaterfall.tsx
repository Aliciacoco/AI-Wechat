'use client'

import { useState, useEffect } from 'react'

// 模拟数据：实际开发时可以从 API 获取
const MOCK_FEEDS = [
  { id: 1, school: '南师大', title: '随园的秋天，是藏在银杏叶里的诗', date: '3小时前', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
  { id: 2, school: '北师大', title: '百廿京师，教育报国：我们要走的路', date: '5小时前', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
  { id: 3, school: '华东师大', title: '重磅！我校科研团队在《Nature》发表最新成果', date: '1天前', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
  { id: 4, school: '苏大', title: '关于二〇二六届毕业生图像采集的通知', date: '2天前', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
  { id: 5, school: '南师大', title: '百年校庆预热：寻找最美校友笑脸', date: '4小时前', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
]

interface FeedWaterfallProps {
  filter: string
}

export default function FeedWaterfall({ filter }: FeedWaterfallProps) {
  const filteredData = filter === 'all' ? MOCK_FEEDS : MOCK_FEEDS.filter(item => item.school === filter)

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {filteredData.map((item) => (
        <div 
          key={item.id} 
          className="break-inside-avoid bg-white border border-[#EDEDED] rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
        >
          {/* 封面图 */}
          <div className="relative overflow-hidden aspect-[4/3]">
            <img 
              src={item.cover} 
              alt={item.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* 内容区 */}
          <div className="p-4">
            <h3 className="text-[15px] font-bold text-[#37352F] leading-snug mb-3 group-hover:text-[#AC202D] transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-100 rounded-full flex-shrink-0" />
                <span className="text-[12px] text-[#5F5E5B] font-medium">{item.school}</span>
              </div>
              <span className="text-[11px] text-[#9B9A97]">{item.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}