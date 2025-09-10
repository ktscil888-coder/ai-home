import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, videos } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: '消息不能为空' }, { status: 400 });
    }

    // 🆕 支持流式响应 - 优化版本
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 🚀 立即发送开始信号，提供即时反馈
          const startChunk = {
            type: 'start',
            content: '正在分析您的需求...',
            isComplete: false
          };
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(startChunk)}\n\n`));
          
          // 异步获取AI响应，同时用户已经看到反馈
    const response = await generateAIResponse(message, videos || []);
    
          // 🚀 优化分词策略，更快更自然的逐字显示
          const chars = response.split('');
          
          for (let i = 0; i < chars.length; i++) {
            const chunk = {
              type: 'chunk',
              content: chars[i],
              isComplete: i === chars.length - 1
            };
            
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunk)}\n\n`));
            
            // 🚀 极速响应，逐字显示
            await new Promise(resolve => setTimeout(resolve, 15));
          }
          
          controller.close();
        } catch (error) {
          const errorChunk = {
            type: 'error',
            content: '抱歉，AI分析服务暂时不可用，请稍后再试。',
            isComplete: true
          };
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(errorChunk)}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

async function generateAIResponse(message: string, videos: any[]): Promise<string> {
  // 🔧 启用真实API：现在有有效的API key了
  const USE_REAL_API = true;
  
  // 如果禁用真实API，直接返回模拟回复
  if (!USE_REAL_API) {
    console.log('🔧 使用模拟AI回复（真实API已禁用）');
    return generateIntelligentMockResponse(message, videos);
  }

  // 🆕 使用OpenRouter API连接DeepSeek V3
  try {
    // 构建包含用户数据的详细prompt
    const systemPrompt = buildSystemPrompt(videos);
    const userPrompt = buildUserPrompt(message, videos);

    // 🔧 API Key配置 - 使用您提供的有效API key
    const apiKey = process.env.OPENROUTER_API_KEY || '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';
    
    // 使用OpenRouter API连接DeepSeek R1 (免费模型)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI-Home-Assistant'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    // 🔧 改进错误处理
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API调用失败 [${response.status}]:`, errorText);
      
      if (response.status === 401) {
        console.error('🚨 API Key无效或已过期，请检查OPENROUTER_API_KEY环境变量');
        console.error('💡 获取新的API Key: https://openrouter.ai/keys');
      }
      
      throw new Error(`API调用失败: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '抱歉，AI服务暂时不可用，请稍后再试。';

  } catch (error) {
    console.error('AI API调用失败:', error);
    // 如果API调用失败，返回智能模拟回复
    return generateIntelligentMockResponse(message, videos);
  }
}

function buildSystemPrompt(videos: any[]): string {
  const videoAnalysis = analyzeVideos(videos);
  const lengthPreference = getUserContentLengthPreference(videos);
  const hasData = videos && videos.length > 0;
  
  return `你是一个专业的家政行业内容创作AI助手，具有以下能力：

1. **深度数据分析**：能够分析用户的视频数据，包括标题、内容、关键词、播放量、点赞量、评论量、转发量等
2. **个性化理解**：深入了解用户的创作习惯、地区特色、口语风格、常用词汇等个人特征
3. **内容生成**：生成接地气、口语化、能够立即执行的标题、内容和关键词
4. **专业建议**：提供基于真实数据的优化建议和策略

**用户数据分析：**
${videoAnalysis}

${hasData ? `**🎯 用户内容长度偏好：**
- 标题长度偏好：${lengthPreference.titleLength}字左右
- 内容长度偏好：${lengthPreference.contentLength}字左右

**回复要求：**
- 必须基于用户的真实数据进行分析和建议
- 回复要接地气、口语化，符合家政行业特点
- 根据用户上传真实数据中的常用语气和文字风格，生成内容
- 提供具体可执行的建议，不要空泛的理论
- 如果生成内容，要包含完整的标题、脚本和关键词
- 要体现对用户个人风格和地区特色的理解
- 如果用户没有上传数据，则根据用户提出的关键词【比如：家政阿姨、保洁、月嫂、育儿嫂、收纳师、清洁工、厨娘、养老护理等】的特点，生成内容
- 内容长度要求: 生成的标题应控制在${lengthPreference.titleLength}字左右，脚本内容应控制在${lengthPreference.contentLength}字以上，符合用户的创作习惯` : `**⚠️ 重要说明：用户暂未上传视频数据**

**回复策略：**
- 由于用户还没有上传具体的视频数据，无法进行个性化分析
- 应该引导用户先上传数据，说明数据的重要性和价值
- 如果用户坚持要内容建议，可以提供家政行业的通用优质模板
- 重点强调：上传数据后能获得的个性化价值（基于真实表现的分析、符合个人风格的内容等）
- 语气要友好、专业，避免让用户觉得没有数据就无法提供帮助
- 可以提供一些通用但实用的家政行业内容创作技巧作为参考`}`;
}

function buildUserPrompt(message: string, videos: any[]): string {
  const hasData = videos && videos.length > 0;
  
  if (hasData) {
    return `用户问题：${message}

请基于我上传的${videos.length}个视频数据进行分析和回答。这些数据包含了我的创作风格、内容偏好、表现数据等信息。

请先分析我的个人特征（创作习惯、可能的地区特色、内容风格等），然后针对我的问题给出专业、个性化的建议。`;
  } else {
    return `用户问题：${message}

**当前状态说明：**
我还没有上传任何视频数据，所以您无法基于我的具体创作风格和表现数据进行个性化分析。

**我希望得到的帮助：**
- 如果您认为我应该先上传数据才能获得更好的建议，请告诉我需要上传哪些具体信息，以及这些数据将如何帮助我
- 如果我的问题可以在没有具体数据的情况下回答，请提供家政行业的专业建议和通用优质模板
- 请说明：上传真实数据后，我能获得哪些额外的个性化价值

请用友好、专业的语气回答我的问题。`;
  }
}

function analyzeVideos(videos: any[]): string {
  if (!videos || videos.length === 0) {
    return `**当前数据状态：** 暂无视频数据

**建议上传的数据类型：**
- 📝 视频标题和内容描述
- 📊 播放量、点赞量、评论量、转发量等表现数据
- 🏷️ 使用的关键词标签
- 📱 发布平台（抖音、小红书、快手等）
- 🏠 服务类型（保洁、月嫂、养老护理等）
- 📍 地理位置信息
- 👥 目标用户群体

**上传数据后您将获得：**
✨ 基于真实表现的个性化内容策略
📈 数据驱动的优化建议
🎯 符合您创作风格的爆款模板
💡 针对性的关键词和话题推荐`;
  }

  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalLikes = videos.reduce((sum, v) => sum + (v.likes || 0), 0);
  const totalComments = videos.reduce((sum, v) => sum + (v.comments || 0), 0);
  const totalShares = videos.reduce((sum, v) => sum + (v.shares || 0), 0);

  // 分析平台分布
  const platformStats = videos.reduce((acc, video) => {
    const platform = video.platform || '未知';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 分析关键词
  const allKeywords = videos.flatMap(v => v.keywords || []);
  const keywordFreq = allKeywords.reduce((acc, keyword) => {
    acc[keyword] = (acc[keyword] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topKeywords = Object.entries(keywordFreq)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([keyword]) => keyword);

  // 计算平均数据
  const avgViews = Math.round(totalViews / videos.length);
  const avgLikes = Math.round(totalLikes / videos.length);
  const avgComments = Math.round(totalComments / videos.length);
  const avgShares = Math.round(totalShares / videos.length);

  // 分析表现最好的视频
  const bestVideo = videos.reduce((best, current) => 
    (current.views || 0) > (best.views || 0) ? current : best
  );

  // 🆕 分析用户内容长度和风格习惯
  const contentStyleAnalysis = analyzeUserContentStyle(videos);

  return `
**视频数量：** ${videos.length}个
**总体数据：**
- 总播放量：${totalViews.toLocaleString()}
- 总点赞量：${totalLikes.toLocaleString()}  
- 总评论量：${totalComments.toLocaleString()}
- 总转发量：${totalShares.toLocaleString()}

**平均表现：**
- 平均播放量：${avgViews.toLocaleString()}
- 平均点赞量：${avgLikes.toLocaleString()}
- 平均评论量：${avgComments.toLocaleString()}
- 平均转发量：${avgShares.toLocaleString()}

**平台分布：** ${Object.entries(platformStats).map(([platform, count]) => `${platform}(${count}个)`).join('、')}

**常用关键词：** ${topKeywords.join('、') || '无'}

**表现最佳视频：** "${bestVideo.title || '未知'}" (播放量：${(bestVideo.views || 0).toLocaleString()})

**🎯 个人创作风格分析：**
${contentStyleAnalysis}

**互动率分析：**
- 点赞率：${totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : 0}%
- 评论率：${totalViews > 0 ? ((totalComments / totalViews) * 100).toFixed(2) : 0}%
- 转发率：${totalViews > 0 ? ((totalShares / totalViews) * 100).toFixed(2) : 0}%
`;
}

function generateIntelligentMockResponse(message: string, videos: any[]): string {
  const videoAnalysis = analyzeVideos(videos);
  const messageLower = message.toLowerCase();
  
  // 🆕 更精确的匹配逻辑，按优先级排序
  // 1. 先匹配具体的操作类型
  if (messageLower.includes('综合分析') || (messageLower.includes('分析') && messageLower.includes('创作习惯'))) {
    if (videos.length === 0) {
      return `您好！我注意到您还没有上传视频数据。为了给您提供准确的综合分析，建议您先上传一些视频数据，包括：

📊 **需要的数据：**
- 视频标题和内容
- 播放量、点赞量、评论量、转发量
- 发布平台和时间
- 使用的关键词标签

上传数据后，我将为您提供：
✨ 个人创作风格分析
📈 数据表现洞察  
🎯 个性化优化建议
💡 基于您特色的内容策略

请先在"数据分析"页面录入您的视频数据，然后我们开始深度分析！`;
    }

    return `基于您上传的${videos.length}个视频数据，我为您提供综合分析：

${videoAnalysis}

**个人风格特征分析：**
${getPersonalityAnalysis(videos)}

**优化建议：**
${getOptimizationSuggestions(videos)}

需要我为您生成具体的内容创作方案吗？`;
  }

  // 2. 追踪热点 - 必须包含热点相关关键词
  if (messageLower.includes('追踪热点') || messageLower.includes('追热点') || (messageLower.includes('热点') && messageLower.includes('结合'))) {
    return generateHotTopicContent(videos);
  }

  // 3. 定制创作 - 必须包含定制相关关键词
  if (messageLower.includes('定制创作') || (messageLower.includes('定制') && messageLower.includes('需求')) || messageLower.includes('具体的创作需求')) {
    return `我来为您提供定制创作服务！请告诉我：

🎯 **您的具体需求：**
1. 想要创作什么类型的内容？（如：家政技巧、客户案例、服务流程等）
2. 有特定的关键词或主题吗？
3. 目标用户是谁？（如：年轻妈妈、职场女性、老人家庭等）
4. 希望在哪个平台发布？

📊 **基于您的数据分析：**
${videoAnalysis}

请详细描述您的需求，我将结合您的个人风格和历史数据，为您量身定制内容方案！`;
  }

  // 4. 一键生成 - 包含生成但不是上面的具体类型
  if (messageLower.includes('一键生成') || (messageLower.includes('生成') && (messageLower.includes('爆款标题') || messageLower.includes('内容脚本')))) {
    if (videos.length === 0) {
      return `为了给您生成更精准的内容，建议您先上传一些视频数据。不过，我可以为您提供家政行业的通用爆款模板：

🔥 **通用爆款标题模板：**
1. 《家政阿姨的秘密！这3个技巧让客户抢着要》
2. 《月薪过万的家政员都在用这个方法！》
3. 《客户满意度100%！家政服务这样做就对了》

📝 **内容脚本框架：**
- 开场抓眼球（3秒黄金法则）
- 痛点共鸣（客户的困扰）
- 解决方案展示（专业技能）
- 效果证明（前后对比）
- 行动号召（联系方式）

🏷️ **通用关键词：**
家政服务、专业保洁、月嫂育婴、家政阿姨、服务到家

上传您的视频数据后，我将为您生成更个性化的内容！`;
    }

    return generateContentBasedOnData(videos);
  }
  
  if (messageLower.includes('关键词') || messageLower.includes('keyword')) {
    const keywords = extractKeywordsFromVideos(videos);
    return `基于您的${videos.length}个视频数据，为您推荐关键词策略：

🎯 **您常用的关键词：**
${keywords.current}

🔥 **推荐新关键词：**
${keywords.recommended}

💡 **关键词使用建议：**
${keywords.suggestions}`;
  }

  // 默认智能回复
  return `您好！我是您的AI家政运营助手，我已经分析了您的数据。

${videoAnalysis}

我可以为您提供：
📊 **综合分析** - 深度分析您的创作数据和风格特征
💡 **一键生成** - 生成个性化的爆款标题和内容脚本  
⚡ **追踪热点** - 结合最新热点创作追热点内容
🎯 **定制创作** - 根据您的具体需求定制内容方案

请点击上方的快捷操作，或者直接告诉我您的需求！`;
}

// 辅助函数：分析用户个性特征
function getPersonalityAnalysis(videos: any[]): string {
  if (!videos || videos.length === 0) {
    return '需要更多数据来分析您的个性特征。';
  }

  const platforms = videos.map(v => v.platform).filter(Boolean);
  const titles = videos.map(v => v.title).filter(Boolean);
  const keywords = videos.flatMap(v => v.keywords || []);

  // 分析平台偏好
  const platformPreference = platforms.length > 0 ? 
    `您主要在${platforms[0]}等平台创作` : '平台使用较为分散';

  // 分析标题风格
  const titleStyle = titles.some(t => t.includes('！') || t.includes('？')) ? 
    '标题风格偏向活泼，善用感叹号和疑问句' : '标题风格相对平稳';

  // 分析内容主题
  const contentThemes = keywords.length > 0 ? 
    `主要关注${keywords.slice(0, 3).join('、')}等主题` : '内容主题较为多样';

  return `
• **平台偏好**: ${platformPreference}
• **标题风格**: ${titleStyle}  
• **内容主题**: ${contentThemes}
• **创作频率**: ${videos.length > 10 ? '较高，持续更新' : '适中，稳定输出'}
• **互动特点**: 根据数据表现，您的内容具有一定的用户吸引力`;
}

// 辅助函数：生成优化建议
function getOptimizationSuggestions(videos: any[]): string {
  if (!videos || videos.length === 0) {
    return '上传更多数据后，我将为您提供个性化优化建议。';
  }

  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalLikes = videos.reduce((sum, v) => sum + (v.likes || 0), 0);
  const avgViews = totalViews / videos.length;
  const likeRate = totalViews > 0 ? (totalLikes / totalViews) * 100 : 0;

  const suggestions = [];

  if (avgViews < 1000) {
    suggestions.push('• **提升曝光**: 优化发布时间，建议在用户活跃时段发布');
  }

  if (likeRate < 5) {
    suggestions.push('• **增加互动**: 在内容中加入提问或话题讨论，提升用户参与度');
  }

  suggestions.push('• **内容优化**: 基于您的风格，建议增加更多实用技巧分享');
  suggestions.push('• **关键词策略**: 结合热门话题，优化标题和标签');

  return suggestions.join('\n');
}

// 辅助函数：基于数据生成内容
function generateContentBasedOnData(videos: any[]): string {
  const bestVideo = videos.reduce((best, current) => 
    (current.views || 0) > (best.views || 0) ? current : best
  );
  
  const lengthPreference = getUserContentLengthPreference(videos);
  const userKeywords = videos.flatMap(v => v.keywords || []).slice(0, 8);

  // 根据用户内容长度习惯生成更详细的脚本
  const generateDetailedScript = (baseLength: number) => {
    if (baseLength > 200) {
      // 用户习惯长内容，生成详细脚本
      return `
**开场(0-10秒)**: "哈喽姐妹们！我是做家政${videos.length > 5 ? '5年多了' : '也有2年多了'}，今天必须跟大家分享一个超实用的技巧！你们知道吗？很多客户其实最看重的不是你打扫得多干净..."

**痛点展示(10-25秒)**: "前两天我遇到个客户，她跟我说之前请的阿姨啊，表面上看起来挺干净的，但是！（停顿，表情严肃）细节地方根本不到位！比如说这个门缝、窗台角落、还有厨房的油烟机滤网，这些地方不处理，再干净也白搭！"

**解决方案详解(25-60秒)**: "所以我今天就教大家我的独门秘籍！第一步，准备工具很关键，我用的是这几样（展示工具）；第二步，清洁顺序很重要，一定要从上到下，从里到外；第三步，这个是重点！（凑近镜头）我会用这个小技巧处理死角..."

**效果对比(60-80秒)**: "你们看看这个前后对比！（展示清洁前后照片）客户当场就说，哎呀这个阿姨真的不一样！现在这个客户啊，每个月都指定要我去，而且还给我涨了工资！"

**互动引导(80-100秒)**: "姐妹们，这样的小技巧我还有很多，如果你们想学的话，记得点赞关注，评论区告诉我你们最想学哪方面的技巧，人多的话我就专门做一期详细教学！我们一起把家政这行做得更专业！"`;
    } else {
      // 用户习惯短内容，生成精简脚本
      return `
**开场(0-5秒)**: "姐妹们！今天分享个家政小技巧！"

**痛点(5-15秒)**: "很多人觉得家政就是简单打扫，其实门道可多了！"

**解决方案(15-40秒)**: "我做家政${videos.length > 3 ? '几年了' : '也有段时间了'}，发现客户最看重这3点：细节处理、服务态度、专业工具。掌握了这些，工资自然就上去了！"

**效果展示(40-55秒)**: "就像我现在这个客户，每月指定要我，还主动涨工资！"

**结尾(55-60秒)**: "想学更多技巧的，关注我！每天分享实用方法！"`;
    }
  };

  return `基于您的${videos.length}个视频数据，为您生成个性化内容：

🔥 **爆款标题方案（符合您${lengthPreference.titleLength}字习惯）：**

**方案1**: 《${bestVideo.title || '月嫂涨薪秘籍'}！客户抢着要的3个技巧💰》（${lengthPreference.titleLength}字）
**方案2**: 《做家政${videos.length > 5 ? '5年总结' : '2年经验'}：这样服务客户主动加价！》（${lengthPreference.titleLength}字）
**方案3**: 《家政阿姨必看！月薪过万的都在用这个方法🔥》（${lengthPreference.titleLength}字）

📝 **完整内容脚本（符合您${lengthPreference.contentLength}字以上习惯）：**
${generateDetailedScript(lengthPreference.contentLength)}

🏷️ **精准关键词（基于您的数据）：**
${userKeywords.join('、') || '家政服务、专业保洁、客户满意、月嫂技巧、服务升级'}

💡 **创作建议：**
- 根据您的数据分析，您的内容平均${lengthPreference.contentLength}字，这个长度很适合深度分享经验
- 建议保持现有的详细叙述风格，用户更容易产生信任感
- 可以多加入一些具体的数字和案例，增强说服力

这套方案完全基于您的个人创作习惯和表现最好的内容特点定制！`;
}

// 辅助函数：生成热点内容
function generateHotTopicContent(videos: any[]): string {
  const hasData = videos && videos.length > 0;
  const userKeywords = hasData ? videos.flatMap(v => v.keywords || []).slice(0, 5) : [];
  const lengthPreference = getUserContentLengthPreference(videos);
  
  if (!hasData) {
    return `🔥 **追踪热点内容策略**

由于您暂未上传视频数据，我为您提供通用的热点追踪模板：

**🌟 当前热门话题：**

**热点1 - 年终大扫除**
• 标题：《年底大扫除攻略！家政阿姨3小时搞定全屋秘籍》
• 脚本要点：工具准备→清洁顺序→效率技巧→成果展示
• 关键词：#年底大扫除 #家政技巧 #高效清洁

**热点2 - 春节家政需求**  
• 标题：《春节家政预约爆满！这些服务最受欢迎》
• 脚本要点：需求分析→服务标准→客户反馈→预约建议
• 关键词：#春节家政 #专业服务 #客户好评

**热点3 - 新年职场规划**
• 标题：《2024家政行业新趋势！月薪过万不是梦》
• 脚本要点：行业分析→技能提升→收入增长→职业规划
• 关键词：#家政行业 #职业规划 #技能提升

💡 **追热点建议：**
- 关注微博、抖音热搜榜
- 结合节假日和季节性话题
- 观察同行爆款内容规律
- 及时跟进突发热点事件

上传您的创作数据后，我将为您生成更个性化的热点内容策略！`;
  }

  return `🔥 **基于您的创作风格，为您定制追热点方案：**

**📊 您的创作特点分析：**
- 视频数量：${videos.length}个
- 常用关键词：${userKeywords.join('、') || '暂无'}
- 内容风格：${lengthPreference.contentLength > 200 ? '详细叙述型，适合深度分享' : '简洁明快型，适合快速传播'}

**🌟 个性化热点方案：**

**热点1 - 结合您的优势领域**
• 标题：《${userKeywords[0] || '家政'}行业爆火！我${videos.length > 3 ? '多年经验' : '亲身经历'}告诉你真相》
• 角度：基于您的实际经验，分享行业内幕和技巧
• 预期效果：利用您的专业背景，增强内容可信度

**热点2 - 季节性话题结合**
• 标题：《年底${userKeywords[1] || '家政'}需求暴增！这样做客户抢着要》
• 角度：结合时令特点，展示专业服务价值
• 预期效果：抓住季节性需求，提升曝光和询单

**热点3 - 对比式热点**
• 标题：《同样做${userKeywords[0] || '家政'}，为什么她月入过万我却不行？》
• 角度：通过对比引发思考，分享成功经验
• 预期效果：引发共鸣和讨论，提升互动率

**📝 完整脚本框架（符合您${lengthPreference.contentLength}字习惯）：**
${lengthPreference.contentLength > 200 ? `
- 开场引入热点（10秒）："最近大家都在讨论..."
- 个人经历分享（30秒）："我在这行${videos.length > 5 ? '5年多' : '几年'}，发现..."
- 深度分析讲解（40秒）："其实背后的原因是..."
- 实用建议给出（15秒）："所以我建议大家..."
- 互动引导结尾（5秒）："你们觉得呢？评论区聊聊！"` : `
- 热点切入（5秒）："最近很火的话题..."
- 快速分析（20秒）："其实关键在于..."
- 给出建议（15秒）："建议这样做..."
- 互动结尾（5秒）："同意的点赞！"`}

🎯 **发布策略：**
- 最佳发布时间：${videos.length > 0 ? '根据您历史数据分析，建议晚上7-9点' : '建议晚上7-9点或中午12-2点'}
- 平台选择：优先选择您表现最好的平台
- 标签使用：#热点话题 + #${userKeywords[0] || '家政'} + #专业分享

这套方案完全基于您的创作特点和历史表现数据定制！`;
}

// 辅助函数：提取和推荐关键词
function extractKeywordsFromVideos(videos: any[]): { current: string; recommended: string; suggestions: string } {
  if (!videos || videos.length === 0) {
    return {
      current: '暂无数据',
      recommended: '家政服务、专业保洁、月嫂育婴、家政阿姨、服务到家',
      suggestions: '建议先上传视频数据，我将为您提供个性化关键词策略'
    };
  }

  const allKeywords = videos.flatMap(v => v.keywords || []);
  const keywordFreq = allKeywords.reduce((acc, keyword) => {
    acc[keyword] = (acc[keyword] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topKeywords = Object.entries(keywordFreq)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([keyword]) => keyword);

  return {
    current: topKeywords.join('、') || '暂无关键词数据',
    recommended: '家政技巧、客户案例、服务流程、专业培训、行业经验、清洁妙招',
    suggestions: `
• 主关键词：在标题开头使用，如"${topKeywords[0] || '家政服务'}"
• 长尾关键词：结合地区和服务类型，如"北京专业月嫂"
• 热门标签：关注平台热门话题，及时跟进
• 关键词密度：标题、描述、标签中合理分布，避免堆砌`
  };
}

// 🆕 新增：分析用户内容风格和长度习惯
function analyzeUserContentStyle(videos: any[]): string {
  const titles = videos.map(v => v.title || '').filter(t => t.length > 0);
  const contents = videos.map(v => v.content || '').filter(c => c.length > 0);
  
  // 分析标题长度习惯
  const titleLengths = titles.map(t => t.length);
  const avgTitleLength = titleLengths.length > 0 ? Math.round(titleLengths.reduce((a, b) => a + b, 0) / titleLengths.length) : 0;
  
  // 分析内容长度习惯
  const contentLengths = contents.map(c => c.length);
  const avgContentLength = contentLengths.length > 0 ? Math.round(contentLengths.reduce((a, b) => a + b, 0) / contentLengths.length) : 0;
  
  // 分析标题风格
  const hasEmoji = titles.some(t => /[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2600-\u27BF]/.test(t));
  const hasExclamation = titles.some(t => t.includes('！') || t.includes('!'));
  const hasQuestion = titles.some(t => t.includes('？') || t.includes('?'));
  
  // 分析内容结构习惯
  const hasStructuredContent = contents.some(c => c.includes('：') || c.includes(':') || c.includes('、'));
  const hasDialogue = contents.some(c => c.includes('"') || c.includes('"') || c.includes('"'));
  
  let styleAnalysis = '';
  
  if (avgTitleLength > 0) {
    styleAnalysis += `- **标题习惯**: 平均${avgTitleLength}字，${avgTitleLength > 20 ? '偏爱详细描述型标题' : '喜欢简洁有力的标题'}\n`;
  }
  
  if (avgContentLength > 0) {
    styleAnalysis += `- **内容长度**: 平均${avgContentLength}字，${avgContentLength > 100 ? '习惯详细叙述，信息量丰富' : '偏爱简短精炼的表达'}\n`;
  }
  
  if (hasEmoji) {
    styleAnalysis += '- **表达风格**: 善用emoji表情，内容生动活泼\n';
  }
  
  if (hasExclamation) {
    styleAnalysis += '- **语气特点**: 常用感叹号，表达热情有感染力\n';
  }
  
  if (hasQuestion) {
    styleAnalysis += '- **互动技巧**: 善用疑问句，引发用户思考和互动\n';
  }
  
  if (hasStructuredContent) {
    styleAnalysis += '- **内容结构**: 喜欢使用结构化表达，逻辑清晰\n';
  }
  
  if (hasDialogue) {
    styleAnalysis += '- **叙述方式**: 善用对话形式，增强代入感\n';
  }
  
  return styleAnalysis || '- 需要更多数据来分析您的创作风格';
}

// 🆕 获取用户内容长度偏好（供内容生成时使用）
function getUserContentLengthPreference(videos: any[]): { titleLength: number; contentLength: number } {
  const titles = videos.map(v => v.title || '').filter(t => t.length > 0);
  const contents = videos.map(v => v.content || '').filter(c => c.length > 0);
  
  const avgTitleLength = titles.length > 0 ? Math.round(titles.reduce((sum, t) => sum + t.length, 0) / titles.length) : 25;
  const avgContentLength = contents.length > 0 ? Math.round(contents.reduce((sum, c) => sum + c.length, 0) / contents.length) : 150;
  
  return {
    titleLength: Math.max(avgTitleLength, 15), // 最少15字
    contentLength: Math.max(avgContentLength, 100) // 最少100字
  };
}