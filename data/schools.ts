// 学校信息
export const SCHOOLS: Record<string, { name: string; shortName: string; logo: string }> = {
  '北京大学': { name: '北京大学', shortName: '北大', logo: '/schools/北大.jpg' },
  '北京师大': { name: '北京师范大学', shortName: '北师', logo: '/schools/北京师范大学.jpg' },
  '中国科学技术大学': { name: '中国科学技术大学', shortName: '中科大', logo: '/schools/中国科学技术大学.jpg' },
  '深圳大学': { name: '深圳大学', shortName: '深大', logo: '/schools/深圳大学.jpg' },
  '华东师大': { name: '华东师范大学', shortName: '华师', logo: '/schools/华东师范大学.jpg' },
  '南京大学': { name: '南京大学', shortName: '南大', logo: '/schools/南京大学.jpg' },
  '苏州大学': { name: '苏州大学', shortName: '苏大', logo: '/schools/苏州大学.jpg' },
  '南京师大': { name: '南京师范大学', shortName: '南师', logo: '/schools/njnu.jpg' },
  '南师招生': { name: '南师招生', shortName: '招生', logo: '/schools/njnu-zs.jpg' },
  '东华大学': { name: '东华大学', shortName: '东华', logo: '/schools/东华大学.jpg' },
  '复旦': { name: '复旦大学', shortName: '复旦', logo: '/schools/复旦.jpg' },
  '上海大学': { name: '上海大学', shortName: '上大', logo: '/schools/上海大学.jpg' },
  // 以下为 school-profiles 中的学校账号占位（暂无图片时用文字头像）
  '东南大学': { name: '东南大学', shortName: '东大', logo: '/schools/东南大学.jpg' },
  '南京医科大学': { name: '南京医科大学', shortName: '南医大', logo: '/schools/南京医科大学.jpg' },
  '金陵科技学院': { name: '金陵科技学院', shortName: '金科', logo: '/schools/金陵科技学院.jpg' },
}

// 标杆案例数据
export const BENCHMARK_ARTICLES = [
  {
    school: '北京大学',
    articles: [
      { id: '1', title: '上新！北大短剧来了', date: '星期一', views: 100000, likes: 2174, url: '' },
      { id: '2', title: '一夜站票来北大的女孩，17年后成为AI科学家', date: '3月8日', views: 100000, likes: 3904, url: '' },
    ],
  },
  {
    school: '中国科学技术大学',
    articles: [
      { id: '3', title: '中国科大，67岁生日快乐！', date: '9月20日', views: 60000, likes: 1887, url: '' },
      { id: '4', title: '两位90后东华校友，开创女性运动品牌！', date: '1月15日', views: 23000, likes: 323, url: '' },
      { id: '5', title: '今天，你有几个DDL？', date: '1月14日', views: 12000, likes: 311, url: '' },
    ],
  },
  {
    school: '上海大学',
    articles: [
      { id: '6', title: '"有空回来，阿姨还给你煮面"', date: '2025-11-28', views: 25000, likes: 574, url: '' },
      { id: '7', title: '菊香盈袖赴秋约，上海大学第二十三届菊文化节开始啦！', date: '2025-11-20', views: 16000, likes: 301, url: '' },
    ],
  },
  {
    school: '深圳大学',
    articles: [
      { id: '8', title: '明天你是否依然爱我', date: '2025年6月20日', views: 100000, likes: 4060, url: 'https://mp.weixin.qq.com/s/ljzg6tQwcLTNa0hs8tURsQ' },
      { id: '9', title: '⌛100天，深大等你！', date: '2月26日', views: 28000, likes: 983, url: 'https://mp.weixin.qq.com/s/vxXhx9kb6C_oNQvO1Y3naQ' },
      { id: '10', title: '这是我们的选择', date: '1月1日', views: 24000, likes: 907, url: 'https://mp.weixin.qq.com/s/qnp5Yb9TfBoRjrYEh3ml-w' },
      { id: '11', title: '"销冠"竟然在我身边', date: '星期五', views: 10000, likes: 197, url: 'https://mp.weixin.qq.com/s/lepvIzTZhUOHuQ_tuvmnPA' },
    ],
  },
]

// 关注高校最新发布
export const FOLLOWED_SCHOOLS_ARTICLES = [
  {
    school: '华东师大',
    articles: [
      { id: '1', title: '答好必答题，走好必经路！华东师大这场大会明确开局目标', date: '昨天', views: 3453, likes: 54, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '2', title: '首讲华东师大！四位"申城女主角"亮相', date: '星期二', views: 10000, likes: 92, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '3', title: '于漪与华东师大的教育深情：把"教书育人"切装到心里', date: '星期二', views: 6443, likes: 193, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '4', title: '50支少年队齐聚华东师大，争夺全球决赛入场券！', date: '星期一', views: 7981, likes: 112, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '5', title: '华东师大再次入选，教育部典型项目+2！', date: '星期六', views: 11000, likes: 140, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
    ],
  },
  {
    school: '南京大学',
    articles: [
      { id: '6', title: '南京大学召开2026年全国两会精神传达报告会暨新学期工作布置会', date: '昨天', views: 4378, likes: 94, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '7', title: '先生之风 山高水长！谨以此片纪念匡亚明诞辰120周年', date: '星期二', views: 3894, likes: 175, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '8', title: '建言新程 聚力奋进！全国两会我校人大代表、政协委员履职侧记', date: '星期一', views: 2482, likes: 59, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '9', title: '纪念老书记老校长！今天这场研讨会在京召开', date: '星期六', views: 27000, likes: 359, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
    ],
  },
  {
    school: '北京师大',
    articles: [
      { id: '10', title: '榜样力量｜北京师范大学第26届"十佳大学生"风采展示', date: '昨天', views: 33000, likes: 492, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '11', title: '李连生：三十载光阴育桃李，教育之爱连绵生长', date: '星期二', views: 2384, likes: 80, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '12', title: '新学期接力赛｜@BNUer，交出你的"第一棒"！', date: '星期日', views: 4260, likes: 141, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '13', title: '权威发布｜北京师范大学2026年硕士研究生招生学校复试基本分数线', date: '星期六', views: 41000, likes: 290, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
    ],
  },
  {
    school: '苏州大学',
    articles: [
      { id: '14', title: '从"心"出发！一起解锁不同快乐~', date: '昨天', views: 4393, likes: 58, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '15', title: '苏州大学召开全国两会精神学习报告会', date: '星期二', views: 5370, likes: 80, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '16', title: '2026苏州春季招聘大会10万+岗位来了！', date: '星期一', views: 16000, likes: 95, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '17', title: '苏大的玉兰，春日顶流！', date: '星期五', views: 35000, likes: 702, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
    ],
  },
  {
    school: '南京师大',
    articles: [
      { id: '18', title: '报名中｜全国教育行业招聘会，就在南师大！', date: '昨天', views: 9742, likes: 108, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '19', title: '招新！南师大融媒体中心等你来！', date: '星期三', views: 4444, likes: 32, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '20', title: '南师春早，"梅"好可期', date: '星期三', views: 7562, likes: 239, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '21', title: 'GLOBAL：这个班级的"硬核"密码！', date: '星期一', views: 17000, likes: 119, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: '22', title: '南京师范大学2026年专业技术人员招聘公告', date: '星期日', views: 31000, likes: 125, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
    ],
  },
]

// 本校账号数据
export const OUR_SCHOOL_ARTICLES = [
  {
    school: '南京师大',
    articles: [
      { id: 'njnu-1', title: '报名中｜全国教育行业招聘会，就在南师大！', date: '昨天', views: 9742, likes: 108, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: 'njnu-2', title: '招新！南师大融媒体中心等你来！', date: '星期三', views: 4444, likes: 32, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: 'njnu-3', title: '南师春早，"梅"好可期', date: '星期三', views: 7562, likes: 239, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: 'njnu-4', title: 'GLOBAL：这个班级的"硬核"密码！', date: '星期一', views: 17000, likes: 119, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: 'njnu-5', title: '南京师范大学2026年专业技术人员招聘公告', date: '星期日', views: 31000, likes: 125, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
    ],
  },
  {
    school: '南师招生',
    articles: [
      { id: 'njnu-zs-1', title: '2026年南师大招生政策解读', date: '星期五', views: 15000, likes: 280, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: 'njnu-zs-2', title: '南师大优势专业介绍', date: '星期四', views: 12000, likes: 195, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: 'njnu-zs-3', title: '走进南师｜校园开放日邀请函', date: '星期三', views: 8500, likes: 150, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
      { id: 'njnu-zs-4', title: '南师大2026年招生简章发布', date: '星期一', views: 25000, likes: 420, url: '#', cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png' },
    ],
  },
]

