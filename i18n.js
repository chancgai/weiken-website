/* ============================================================
   威恳非晶 - 全站中英文切换 i18n
   策略: 文本节点遍历 + 字典替换, 确保页面上所有中文都被翻译
   ============================================================ */

var currentLang = 'zh';

/* ---- 文本字典 (中文 -> 英文), 按长度降序排列以避免短串误匹配 ---- */
var textDict = [
  /* === 长段落 (about 页面) === */
  ["威恳非晶技术（浙江）有限公司是威恳集团旗下以创新驱动发展的先进材料制造企业，成立于2025年，传承前身15年行业深耕经验。公司占地面积31,000平方米，已通过ISO9001质量管理体系、ISO14001环境管理体系、ISO45001职业健康安全管理体系三体系认证。",
   "WCAN Amorphous Technology (Zhejiang) Co., Ltd. is an innovation-driven advanced materials manufacturer under the Wcan Group, established in 2025, inheriting 15 years of deep industry expertise. The company covers 31,000 sqm and has passed ISO9001, ISO14001, and ISO45001 triple system certifications."],
  ["公司非晶合金带材年产能达30,000吨，变压器铁芯年产能达20,000吨，带材宽度覆盖120mm至240mm全系列。产品涵盖铁基非晶合金带材（WCAN-H、WCAN-HK、WCAN-Z三种牌号）、油浸式变压器铁芯、干式变压器铁芯、立体卷铁芯及非晶电机铁芯，广泛应用于国家电网配电系统、新能源汽车驱动电机、高端家电压缩机及无人机永磁电机等领域。",
   "Annual capacity: 30,000 tons of amorphous alloy ribbons and 20,000 tons of transformer cores, with ribbon widths covering 120mm to 240mm. Products include Fe-based amorphous alloy ribbons (WCAN-H, WCAN-HK, WCAN-Z grades), oil-immersed/dry-type/3D wound transformer cores, and amorphous motor cores, widely used in national grid distribution systems, NEV drive motors, high-end home appliance compressors, and drone PM motors."],
  ["截至2025年底，公司拥有专利52项（其中发明专利13项），构建了覆盖\"研发—带材制造—铁芯成品\"的垂直整合体系，致力于成为全球先进的铁基非晶合金材料研发生产企业，以及非晶电机全产业链的引领者。",
   "As of end 2025, the company holds 52 patents (including 13 invention patents), and has built a vertical integration system covering R&D, ribbon manufacturing, and core finishing, committed to becoming a globally advanced Fe-based amorphous alloy R&D and production enterprise, and a leader in the full amorphous motor industry chain."],
  ["拥有三条万吨级非晶带材生产线，宽度覆盖120mm~240mm，厚度24~30μm，采用激光刻线与磁畴细化工艺，年产能30,000吨",
   "Three 10,000-ton-class amorphous ribbon production lines, widths covering 120mm~240mm, thickness 24~30μm, using laser scribing and magnetic domain refinement processes, annual capacity 30,000 tons"],
  ["全自动化产线覆盖分条、退火、卷绕、成型、浸油全流程，配备16台大型退火炉及噪音测试室，年产能20,000吨",
   "Fully automated production line covering slitting, annealing, winding, forming, and oil immersion, equipped with 16 large annealing furnaces and noise testing room, annual capacity 20,000 tons"],
  ["高速复合产线支持5合1至8合1铁基非晶带材复合，配备AIDA、MINSTER等冲压设备，家电铁芯年产18万台，汽车驱动铁芯年产1,600台",
   "High-speed composite production line supporting 5-in-1 to 8-in-1 Fe-based amorphous ribbon lamination, equipped with AIDA, MINSTER stamping equipment, annual output 180,000 home appliance cores and 1,600 automotive drive motor cores"],
  ["截至2025年底，公司拥有专利52项，其中发明专利13项，覆盖非晶合金成分优化、带材生产工艺及铁芯制造全流程",
   "As of end 2025, the company holds 52 patents, including 13 invention patents, covering amorphous alloy composition optimization, ribbon production processes, and the full core manufacturing process"],
  ["通过ISO9001质量管理体系、ISO14001环境管理体系、ISO45001职业健康安全管理体系认证，实现闭环水循环与废气治理",
   "Certified to ISO9001 Quality Management, ISO14001 Environmental Management, and ISO45001 Occupational Health & Safety Management systems, with closed-loop water recycling and exhaust gas treatment"],
  ["与国内外科研机构合作，建立从合金研发、机械性能优化、电磁性能优化到板形控制的全流程研发体系，参与国家标准制定",
   "Cooperating with domestic and international research institutions, establishing a full-process R&D system from alloy development, mechanical property optimization, electromagnetic property optimization to shape control, participating in national standard formulation"],

  /* === 首页段落 === */
  ["传承15年技术积淀，专注铁基非晶合金材料研发与生产，驱动高效世界",
   "15 years of technical expertise in Fe-based amorphous alloy R&D and manufacturing, driving an efficient world"],
  ["三条万吨级非晶带材产线，年产能30,000吨带材与20,000吨铁芯，从材料到成品全流程覆盖",
   "Three 10,000-ton amorphous ribbon lines, annual capacity of 30,000 tons ribbon & 20,000 tons cores, full process coverage"],
  ["产品远销亚洲、美洲、欧洲，与三星、LG、特变电工等全球知名企业建立长期合作",
   "Products exported to Asia, Americas, and Europe, with long-term partnerships with Samsung, LG, TBEA and more"],
  ["威恳非晶技术（浙江）有限公司是威恳集团旗下以创新驱动发展的先进材料制造企业，成立于2025年，传承前身15年行业深耕经验。公司占地面积31,000平方米，非晶合金带材年产能达30,000吨，变压器铁芯年产能达20,000吨。",
   "WCAN Amorphous Technology (Zhejiang) Co., Ltd. is an innovation-driven advanced materials manufacturer under the Wcan Group, established in 2025, inheriting 15 years of industry expertise. The company covers 31,000 sqm, with annual capacity of 30,000 tons of amorphous alloy ribbons and 20,000 tons of transformer cores."],
  ["公司构建了覆盖\"研发—带材制造—铁芯成品\"的垂直整合体系，产品涵盖铁基非晶合金带材、油浸式/干式/立体变压器铁芯及非晶电机铁芯，广泛应用于国家电网、新能源、新能源汽车及高端家电领域。已通过ISO9001、ISO14001、ISO45001三体系认证，拥有专利52项（含发明专利13项）。",
   "The company has built a vertical integration system covering R&D, ribbon manufacturing, and core finishing. Products include Fe-based amorphous alloy ribbons, oil-immersed/dry-type/3D wound transformer cores, and amorphous motor cores, widely used in national grid, new energy, NEV, and high-end home appliance sectors. Certified to ISO9001, ISO14001, ISO45001, with 52 patents (including 13 invention patents)."],
  ["致力于成为全球先进的铁基非晶合金材料研发生产企业，以及非晶电机全产业链的引领者",
   "Committed to becoming a globally advanced Fe-based amorphous alloy R&D and production enterprise, and a leader in the full amorphous motor industry chain"],
  ["以非晶合金材料创新推动能源效率提升，为全球电力基础设施升级和绿色低碳发展提供核心材料支撑",
   "Promoting energy efficiency through amorphous alloy material innovation, providing core material support for global power infrastructure upgrade and green low-carbon development"],
  ["技术创新为核心驱动力，与高校、企业及OEM客户协同创新，以精益求精的工艺保障产品品质",
   "Technology innovation as the core driving force, collaborative innovation with universities, enterprises, and OEM customers, ensuring product quality through精益求精 craftsmanship"],
  ["采用快速凝固工艺生产，具有高磁导率、低铁损特性，是制造高效变压器铁芯的核心材料",
   "Produced by rapid solidification process with high permeability and low core loss, the core material for high-efficiency transformer cores"],
  ["采用非晶合金带材卷绕成型，低空载损耗，适用于配电变压器，显著降低运行能耗",
   "Wound from amorphous alloy ribbon with ultra-low no-load loss, ideal for distribution transformers, significantly reducing operating energy consumption"],
  ["适用于环氧浇注干式变压器，防火阻燃，低噪音，广泛应用于商业楼宇与数据中心",
   "Suitable for epoxy cast dry-type transformers, fire-resistant and low-noise, widely used in commercial buildings and data centers"],
  ["三维卷铁芯结构，磁路对称平衡，谐波低、机械强度高，适用于节能型立体卷铁芯变压器",
   "3D wound core structure with symmetric magnetic circuit, low harmonics and high mechanical strength, suitable for energy-saving 3D wound core transformers"],
  ["专为高效电机设计，高频铁损低，适用于新能源汽车驱动电机及工业高效电机",
   "Designed for high-efficiency motors with low high-frequency core loss, suitable for NEV drive motors and industrial high-efficiency motors"],
  ["面向新能源汽车、家电及工业电机领域，提供非晶合金产品定制化解决方案，满足多样化应用需求",
   "Providing customized amorphous alloy product solutions for NEV, home appliance, and industrial motor applications, meeting diverse application needs"],
  ["威恳非晶凭借优异的材料性能和稳定的制造能力，在中国变压器供应链中占据重要地位，并建立了覆盖亚洲、美洲、欧洲的全球服务网络。在变压器铁芯领域，与韩国电力（KEPCO）、特变电工、扬电科技、高晶股份等建立长期战略合作；在电机铁芯领域，与三星、LG、现代、起亚、博格华纳、中车、三花、万都等全球知名新能源和高端家电电机制造商深度合作。",
   "WCAN Amorphous, with excellent material performance and stable manufacturing capability, holds an important position in China's transformer supply chain and has established a global service network covering Asia, Americas, and Europe. In the transformer core field, it has long-term strategic partnerships with KEPCO, TBEA, Yangdian Technology, Gaojing Shares, etc. In the motor core field, it collaborates deeply with global renowned NEV and high-end home appliance motor manufacturers including Samsung, LG, Hyundai, Kia, BorgWarner, CRRC, Sanhua, and Mando."],
  ["威恳非晶技术（浙江）有限公司（Wcan Amorphous），传承15年行业经验，专注铁基非晶合金带材及变压器/电机铁芯的研发与制造，年产能30,000吨带材、20,000吨铁芯，服务全球电力与新能源客户。",
   "WCAN Amorphous Technology (Zhejiang) Co., Ltd., with 15 years of industry experience, specializes in Fe-based amorphous alloy ribbons and transformer/motor cores R&D and manufacturing. Annual capacity: 30,000 tons of ribbons, 20,000 tons of cores, serving global power and new energy customers."],

  /* === 产品详情页描述 === */
  ["采用铁基非晶合金带材卷绕并经磁场退火处理而成，空载损耗较传统硅钢铁芯降低60%~70%，是制造节能型油浸式变压器的核心部件",
   "Wound from Fe-based amorphous alloy ribbon and magnetic field annealed, with no-load loss 60%~70% lower than traditional silicon steel cores, the core component for energy-saving oil-immersed transformers"],
  ["适用于SCH系列干式变压器的非晶合金铁芯，采用三框三柱或四框五柱结构，防火阻燃、低噪音，能效等级可达SC(B)H15/SC(B)H17/SC(B)J19",
   "Amorphous alloy core for SCH series dry-type transformers, using 3-frame 3-column or 4-frame 5-column structure, fire-resistant, low-noise, efficiency class up to SC(B)H15/SC(B)H17/SC(B)J19"],
  ["突破平面结构的局限，将非晶带材卷绕成三个独立的单框，组装成等边三角形立体结构。三相磁路完全对称，空载损耗和噪音显著降低，是新一代节能型变压器的理想铁芯",
   "Breaking through the limitations of planar structure, amorphous ribbon is wound into three independent single frames, assembled into an equilateral triangle 3D structure. Three-phase magnetic circuit is fully symmetric, with significantly reduced no-load loss and noise, the ideal core for new-generation energy-saving transformers"],
  ["采用铁基非晶合金多层复合带材（五合一至八合一粘合工艺），高频铁损较硅钢降低80%~93%，助力电机效率迈向IE4/IE5超高能效等级",
   "Using Fe-based amorphous alloy multi-layer composite ribbon (5-in-1 to 8-in-1 bonding process), high-frequency core loss 80%~93% lower than silicon steel, helping motors achieve IE4/IE5 ultra-high efficiency"],

  /* === 新闻页 === */
  ["2026年6月18日，公司技术团队应邀出席全国非晶合金材料技术研讨会，并在会上作了关于铁基非晶带材磁畴细化技术的专题报告，获得与会专家的高度评价。",
   "On June 18, 2026, the company's technical team attended the National Amorphous Alloy Materials Technology Seminar and presented a special report on magnetic domain refinement technology for Fe-based amorphous ribbons, receiving high praise from attending experts."],
  ["经过为期半年的设备安装调试，公司新增的两条非晶带材生产线正式投产运行。新增产线采用先进的快速凝固工艺，使公司带材年产能提升至30,000吨。",
   "After six months of equipment installation and commissioning, two new amorphous ribbon production lines were officially put into operation. The new lines use advanced rapid solidification process, increasing annual ribbon capacity to 30,000 tons."],
  ["公司顺利通过ISO 9001:2015质量管理体系年度监督审核，标志着公司在质量管理方面持续符合国际标准要求，为客户提供可靠的产品质量保障。",
   "The company successfully passed the ISO 9001:2015 Quality Management System annual surveillance audit, marking continuous compliance with international standards and providing customers with reliable product quality assurance."],
  ["公司自主研发的\"一种非晶合金立体卷铁芯结构\"获国家发明专利授权。该专利突破了传统平面铁芯结构限制，显著提升了变压器的能效水平。",
   "The company's self-developed \"Amorphous Alloy 3D Wound Core Structure\" was granted a national invention patent. This patent breaks through the limitations of traditional planar core structure, significantly improving transformer efficiency."],
  ["威恳非晶与浙江某高校材料科学与工程学院签订产学研合作协议，双方将在非晶合金成分优化、带材成形工艺等领域开展深度合作研究。",
   "WCAN signed an industry-university-research cooperation agreement with the School of Materials Science and Engineering of a Zhejiang university. The two parties will conduct in-depth cooperative research in amorphous alloy composition optimization, ribbon forming processes, and other fields."],
  ["公司携铁基非晶合金带材、油浸式及干式变压器铁芯、非晶电机铁芯等核心产品参展2026中国国际电力设备及技术展览会，吸引了众多行业客户驻足洽谈。",
   "The company exhibited core products including Fe-based amorphous alloy ribbons, oil-immersed and dry-type transformer cores, and amorphous motor cores at the 2026 China International Electric Power Equipment and Technology Exhibition, attracting numerous industry clients for negotiations."],
  ["威恳非晶出席全国非晶合金材料技术研讨会", "WCAN Attends National Amorphous Alloy Materials Technology Seminar"],
  ["公司新增两条非晶带材生产线正式投产", "Two New Amorphous Ribbon Production Lines Put into Operation"],
  ["威恳非晶通过ISO 9001质量管理体系年度审核", "WCAN Passes ISO 9001 Quality Management System Annual Audit"],
  ["立体变压器铁芯产品获国家发明专利授权", "3D Wound Transformer Core Product Granted National Invention Patent"],
  ["公司与浙江某高校签订产学研合作协议", "Company Signs Industry-University-Research Cooperation Agreement"],
  ["威恳非晶参展2026中国国际电力设备及技术展览会", "WCAN Exhibits at 2026 China International Electric Power Equipment Exhibition"],

  /* === 采购页 === */
  ["当前没有进行中的招标采购公告，如有合作意向请通过邮箱联系采购部门。", "There are currently no ongoing procurement announcements. For cooperation intentions, please contact the procurement department via email."],
  ["采购部邮箱：baohtsz@wcan.com", "Procurement Email: baohtsz@wcan.com"],

  /* === 联系页 === */
  ["如有合作意向或产品咨询，欢迎随时与我们取得联系", "For partnership inquiries or product consultation, please feel free to contact us"],
  ["威恳非晶技术（浙江）有限公司（Wcan Amorphous Technology），期待与您建立合作关系。无论您对产品规格有咨询需求，还是希望探讨技术合作，我们都将尽快为您解答。",
   "WCAN Amorphous Technology (Zhejiang) Co., Ltd. looks forward to establishing a partnership with you. Whether you have product specification inquiries or wish to explore technical cooperation, we will respond promptly."],
  ["浙江省宁波市慈溪市新兴一路（No. 39, Xinxing 1st Road, Cixi City, Ningbo, Zhejiang Province）",
   "No. 39, Xinxing 1st Road, Cixi City, Ningbo, Zhejiang Province"],
  ["周一至周五 08:00 - 17:00", "Monday to Friday 08:00 - 17:00"],
  ["周一至周五  08:00 - 17:00", "Monday to Friday 08:00 - 17:00"],
  ["请输入您的姓名", "Please enter your name"],
  ["请输入您的手机号码", "Please enter your phone number"],
  ["请输入您的邮箱地址", "Please enter your email address"],
  ["请简要描述您的需求或问题", "Please briefly describe your needs or questions"],

  /* === About 页面标题和子标题 === */
  ["传承15年技术积淀，专注先进非晶合金材料制造，构建全链整合平台",
   "Inheriting 15 years of technical expertise, focusing on advanced amorphous alloy manufacturing, building a full-chain integration platform"],
  ["十五载技术积淀，专注先进非晶合金材料制造",
   "15 Years of Expertise in Advanced Amorphous Alloy Manufacturing"],
  ["从材料研发到产品制造，构建完整非晶合金产业链条",
   "From material R&D to product manufacturing, building a complete amorphous alloy industry chain"],
  ["以完善的质量管理体系保障产品可靠性",
   "Ensuring product reliability through comprehensive quality management systems"],
  ["52项专利（含13项发明专利）", "52 Patents (including 13 invention patents)"],
  ["三体系认证", "Triple System Certification"],
  ["研发体系与品质保障", "R&D System & Quality Assurance"],
  ["非晶带材制造", "Amorphous Ribbon Manufacturing"],
  ["变压器铁芯加工", "Transformer Core Processing"],
  ["复合带材与电机铁芯", "Composite Ribbon & Motor Cores"],
  ["核心业务", "Core Business"],
  ["资质实力", "Qualifications"],

  /* === 产品详情页 - 横幅和规格 === */
  ["高磁导率、低矫顽力、低铁损的高效节能软磁材料",
   "High permeability, low coercivity, low core loss energy-efficient soft magnetic material"],
  ["采用铁基非晶合金带材卷绕成型，空载损耗较硅钢降低70%以上",
   "Wound from Fe-based amorphous alloy ribbon, no-load loss reduced by over 70% compared to silicon steel"],
  ["适用于SCH系列干式变压器，可达SC(B)H15/SC(B)H17/SC(B)J19能效等级",
   "Suitable for SCH series dry-type transformers, up to SC(B)H15/SC(B)H17/SC(B)J19 efficiency class"],
  ["三维卷绕结构，三相磁路完全对称，低损耗低噪音的节能型铁芯",
   "3D wound structure, fully symmetric three-phase magnetic circuit, low-loss low-noise energy-saving core"],
  ["专为高频高效电机设计，助力电机效率等级迈向 IE4/IE5 超超高能效",
   "Designed for high-frequency high-efficiency motors, helping achieve IE4/IE5 ultra-high efficiency"],

  /* === 规格表头 === */
  ["参数", "Parameter"],
  ["数值", "Value"],
  ["带材宽度 (mm)", "Ribbon Width (mm)"],
  ["平均厚度 (μm)", "Average Thickness (μm)"],
  ["叠片系数 (%)", "Stacking Factor (%)"],
  ["饱和磁感应强度 Bs (T)", "Saturation Flux Density Bs (T)"],
  ["铁损 P (50Hz, 1.35T) (W/kg)", "Core Loss P (50Hz, 1.35T) (W/kg)"],
  ["矫顽力 Hc (A/m)", "Coercivity Hc (A/m)"],
  ["居里温度 Tc (℃)", "Curie Temperature Tc (℃)"],
  ["电阻率 ρ (μΩ·m)", "Resistivity ρ (μΩ·m)"],
  ["适用容量", "Applicable Capacity"],
  ["空载损耗", "No-load Loss"],
  ["铁芯内角R", "Core Inner Corner R"],
  ["叠厚", "Stack Height"],
  ["重量公差", "Weight Tolerance"],
  ["铁芯型式", "Core Type"],
  ["能效等级", "Efficiency Class"],
  ["适用标准", "Applicable Standards"],
  ["结构类型", "Structure Type"],
  ["适用变压器系列", "Applicable Transformer Series"],
  ["应用环境", "Application Environment"],
  ["定制生产", "Custom Production"],
  ["额定容量范围", "Rated Capacity Range"],
  ["铁芯结构", "Core Structure"],
  ["三相对称性", "Three-phase Symmetry"],
  ["完全对称", "Fully Symmetric"],
  ["适用电压", "Applicable Voltage"],
  ["执行标准", "Execution Standard"],
  ["显著低于平面结构", "Significantly lower than planar structure"],
  ["噪音水平", "Noise Level"],
  ["绕制工艺", "Winding Process"],
  ["铜带插入式，半叠绑扎", "Copper strip insertion, half-lap binding"],
  ["材料", "Material"],
  ["铁基非晶合金多层复合带材", "Fe-based amorphous alloy multi-layer composite ribbon"],
  ["叠片方式", "Lamination Method"],
  ["五合一至八合一粘合工艺，最大宽度240mm", "5-in-1 to 8-in-1 bonding process, max width 240mm"],
  ["铁损降低", "Core Loss Reduction"],
  ["较硅钢降低80%~93%", "80%~93% lower than silicon steel"],
  ["铁损 P(400Hz, 1.0T)", "Core Loss P(400Hz, 1.0T)"],
  ["铁损 P(2000Hz, 1.0T)", "Core Loss P(2000Hz, 1.0T)"],
  ["≤2.5 W/kg（硅钢 >20 W/kg）", "≤2.5 W/kg (silicon steel >20 W/kg)"],
  ["最高电机转速", "Maximum Motor Speed"],
  ["年产能", "Annual Capacity"],
  ["家电类180,000台/年；汽车驱动电机类1,600台/年", "Home appliance: 180,000 units/year; Automotive drive motors: 1,600 units/year"],
  ["冲压设备", "Stamping Equipment"],
  ["等边三角形立体卷绕，无缝磁路", "Equilateral triangle 3D wound, seamless magnetic circuit"],
  ["平面单框 / 三相互体 / 拉板结构", "Planar single frame / Three-phase five-limb / Tie-plate structure"],
  ["可根据客户图纸定制", "Customizable according to customer drawings"],
  ["室内使用", "Indoor Use"],

  /* === 应用领域 === */
  ["应用领域", "Applications"],
  ["铁基非晶合金带材凭借优异软磁性能，广泛应用于电力与电子领域",
   "Fe-based amorphous alloy ribbons are widely used in power and electronics due to excellent soft magnetic properties"],
  ["覆盖配电、输电及新能源并网等关键场景",
   "Covering distribution, transmission, and new energy grid connection"],
  ["凭借防火阻燃与低噪音优势，广泛应用于对安全与可靠性要求较高的供电场景",
   "With fire-resistant and low-noise advantages, widely used in power supply scenarios requiring high safety and reliability"],
  ["面向节能配电与新能源接入场景，发挥立体卷铁芯低损耗低噪音优势",
   "For energy-saving distribution and new energy access scenarios, leveraging 3D wound core low-loss low-noise advantages"],
  ["覆盖新能源汽车、家电、无人机及工业高速电机等多元应用场景",
   "Covering NEV, home appliances, drones, and industrial high-speed motors"],
  ["配电变压器铁芯", "Distribution Transformer Cores"],
  ["电流互感器铁芯", "Current Transformer Cores"],
  ["漏电保护器磁芯", "Leakage Protector Magnetic Cores"],
  ["电磁传感器", "Electromagnetic Sensors"],
  ["配电变压器", "Distribution Transformers"],
  ["电力变压器", "Power Transformers"],
  ["箱式变电站", "Box-type Substations"],
  ["新能源发电并网", "New Energy Grid Connection"],
  ["商业楼宇供电", "Commercial Building Power"],
  ["数据中心配电", "Data Center Power Distribution"],
  ["轨道交通供电", "Rail Transit Power"],
  ["医院及学校配电", "Hospital and School Power Distribution"],
  ["节能配电变压器", "Energy-saving Distribution Transformers"],
  ["农网改造", "Rural Grid Transformation"],
  ["城市配电网升级", "Urban Distribution Grid Upgrade"],
  ["新能源发电接入", "New Energy Power Generation Access"],
  ["新能源汽车驱动电机", "NEV Drive Motors"],
  ["高效空调压缩机", "High-efficiency AC Compressors"],
  ["吸尘器/扫地机器人/电吹风", "Vacuum Cleaners/Robot Vacuums/Hair Dryers"],
  ["无人机永磁电机", "Drone PM Motors"],
  ["高速电机及电动工具", "High-speed Motors & Power Tools"],
  ["带材剪切成品", "Ribbon Shearing Products"],
  ["产品实拍", "Product Photos"],

  /* === 规格表数值 === */
  ["较硅钢降低60%~70%", "60%~70% lower than silicon steel"],
  ["暂无招采信息", "No Current Procurement Notices"],
  ["公开透明的招标采购公告，欢迎合格供应商参与合作",
   "Open and transparent procurement announcements, welcoming qualified suppliers to participate"],
  ["从非晶合金带材到各类变压器铁芯，提供全链条产品解决方案",
   "From amorphous alloy ribbons to various transformer cores, providing full-chain product solutions"],

  /* === 产品卡片标题 === */
  ["非晶合金定制服务", "Custom Amorphous Alloy Services"],

  /* === 联系页表单 === */
  ["联系方式", "Contact Information"],
  ["在线留言", "Send Message"],
  ["浙江基地（总部）", "Zhejiang Base (Headquarters)"],
  ["电子邮箱", "Email"],
  ["官方网站", "Official Website"],
  ["工作时间", "Working Hours"],
  ["您的姓名", "Your Name"],
  ["联系电话", "Phone Number"],
  ["留言内容", "Message"],
  ["提交留言", "Submit"],

  /* === 页脚 === */
  ["技术支持：威恳非晶信息技术部", "Technical Support: WCAN IT Dept."],
  ["快速导航", "Quick Links"],

  /* === 企业文化 === */
  ["企业文化", "Corporate Culture"],
  ["以技术创新为驱动，以客户价值为导向，持续推动非晶材料产业发展",
   "Driven by technology innovation, guided by customer value, continuously advancing the amorphous materials industry"],
  ["企业愿景", "Vision"],
  ["企业使命", "Mission"],
  ["核心价值观", "Core Values"],

  /* === 首页其他 === */
  ["非晶之心 澎湃动能", "Amorphous Core, Surging Power"],
  ["精密制造 全链整合", "Precision Manufacturing, Full Chain Integration"],
  ["服务全球 持续创新", "Global Service, Continuous Innovation"],
  ["了解产品", "Products"],
  ["关于威恳", "About WCAN"],
  ["了解更多", "Learn More"],
  ["查看全部产品", "View All Products"],
  ["亚洲", "Asia"],
  ["美洲", "Americas"],
  ["欧洲", "Europe"],
  ["韩国", "Korea"],
  ["越南", "Vietnam"],
  ["印度", "India"],
  ["南美", "S. America"],
  ["联系电话：参见联系我们页面", "Tel: See Contact page"],
  ["邮箱：baohtsz@wcan.com", "Email: baohtsz@wcan.com"],
  ["浙江省宁波市慈溪市新兴一路", "Xinxing 1st Road, Cixi, Ningbo, Zhejiang"],

  /* === 新闻页横幅 === */
  ["了解威恳非晶最新动态、行业资讯与技术创新",
   "Latest updates, industry news, and technological innovations from WCAN"],

  /* === 短文本 (导航等) === */
  ["首页", "Home"],
  ["关于我们", "About Us"],
  ["产品中心", "Products"],
  ["招采信息", "Procurement"],
  ["联系我们", "Contact"],
  ["威恳非晶", "WCAN Amorphous"],
  ["企业新闻", "News"],
  ["铁基非晶合金带材", "Fe-based Amorphous Ribbon"],
  ["油浸式变压器铁芯", "Oil-immersed Transformer Core"],
  ["干式变压器铁芯", "Dry-Type Transformer Core"],
  ["立体变压器铁芯", "3D Wound Transformer Core"],
  ["非晶电机铁芯", "Amorphous Motor Core"]
];

/* ---- 将数组转为对象方便查找, 同时保留有序数组用于遍历 ---- */
var textMap = {};
for (var i = 0; i < textDict.length; i++) {
  textMap[textDict[i][0]] = textDict[i][1];
}

/* ---- 遍历文本节点 ---- */
function walkTextNodes(node, callback) {
  var skipTags = {'SCRIPT':1, 'STYLE':1, 'CODE':1, 'TEXTAREA':1, 'INPUT':1, 'NOSCRIPT':1};
  if (node.nodeType === 1 && skipTags[node.tagName]) return;
  if (node.nodeType === 3) { callback(node); return; }
  var children = node.childNodes;
  for (var i = 0; i < children.length; i++) {
    walkTextNodes(children[i], callback);
  }
}

/* ---- 切换语言 ---- */
function switchLang(lang) {
  if (lang === currentLang) return;
  currentLang = lang;

  /* 更新按钮状态 */
  var btns = document.querySelectorAll('.lang-btn');
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].getAttribute('data-lang') === lang) btns[i].className = 'lang-btn active';
    else btns[i].className = 'lang-btn';
  }

  if (lang === 'en') {
    /* === 切换到英文 === */

    /* 1. 处理 data-i18n 元素 (向后兼容, 用 innerHTML 替换) */
    var i18nEls = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < i18nEls.length; i++) {
      var el = i18nEls[i];
      var key = el.getAttribute('data-i18n');
      var enVal = el.getAttribute('data-i18n-en');
      if (enVal) {
        if (!el.getAttribute('data-zh-orig')) el.setAttribute('data-zh-orig', el.innerHTML);
        el.innerHTML = enVal;
      }
    }

    /* 2. 遍历所有文本节点, 用字典替换 */
    walkTextNodes(document.body, function(node) {
      var text = node.nodeValue;
      if (!text || !text.trim()) return;
      /* 保存原文 */
      if (!node._zhOrig) node._zhOrig = text;
      /* 精确匹配 */
      var trimmed = text.trim();
      if (textMap[trimmed]) {
        node.nodeValue = text.replace(trimmed, textMap[trimmed]);
        return;
      }
      /* 模糊替换: 在文本中查找并替换所有已知中文片段 */
      var newText = text;
      for (var j = 0; j < textDict.length; j++) {
        var zh = textDict[j][0];
        if (newText.indexOf(zh) !== -1) {
          newText = newText.split(zh).join(textDict[j][1]);
        }
      }
      if (newText !== text) node.nodeValue = newText;
    });

    /* 3. 处理 placeholder 属性 */
    var phEls = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    for (var i = 0; i < phEls.length; i++) {
      var ph = phEls[i].getAttribute('placeholder');
      if (ph && textMap[ph]) {
        if (!phEls[i]._zhPhOrig) phEls[i]._zhPhOrig = ph;
        phEls[i].setAttribute('placeholder', textMap[ph]);
      }
    }

  } else {
    /* === 切换回中文 === */

    /* 1. 恢复 data-i18n 元素 */
    var i18nEls = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < i18nEls.length; i++) {
      var orig = i18nEls[i].getAttribute('data-zh-orig');
      if (orig) i18nEls[i].innerHTML = orig;
    }

    /* 2. 恢复文本节点 */
    walkTextNodes(document.body, function(node) {
      if (node._zhOrig) node.nodeValue = node._zhOrig;
    });

    /* 3. 恢复 placeholder */
    var phEls = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    for (var i = 0; i < phEls.length; i++) {
      if (phEls[i]._zhPhOrig) phEls[i].setAttribute('placeholder', phEls[i]._zhPhOrig);
    }
  }

  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}
