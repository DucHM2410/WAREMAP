import type { ContentSection, PublicPage, SiteContent, SitePage } from "./types"

const section = (
  id: string,

  layout: ContentSection["layout"],

  eyebrow: string,

  title: string,

  description: string,

  cards: [string, string][] = [],
): ContentSection => ({
  id,

  layout,

  eyebrow,

  title,

  description,

  cards: cards.map(([title, text]) => ({ title, text })),

  visible: true,

  image: "",

  imageAlt: title,
})

const cta = () =>
  section(
    "start",

    "cta",

    "",

    "Sẵn sàng quản lý kho thông minh hơn?",

    "Trải nghiệm trực quan hóa kho hàng 3D cùng WareMap.",
  )

const features: [string, string][] = [
  [
    "BẢN ĐỒ KHO 3D",

    "Trực quan hóa và xây dựng không gian kho theo khu vực, kệ, tầng và vị trí lưu trữ thực tế.",
  ],

  [
    "ĐỊNH VỊ HÀNG HÓA",

    "Tìm kiếm sản phẩm và xác định chính xác hàng hóa đang được lưu trữ ở đâu trên bản đồ.",
  ],

  [
    "QR XÁC THỰC",

    "Kết hợp QR của vị trí/kệ và QR của sản phẩm/lô hàng để xác nhận đúng hàng, đúng vị trí và hạn chế sai sót.",
  ],

  [
    "QUẢN LÝ HSD & FEFO",

    "Theo dõi hạn sử dụng lô hàng, cảnh báo sản phẩm gần hết hạn và hỗ trợ ưu tiên xuất kho theo nguyên tắc FEFO.",
  ],

  [
    "THEO DÕI LUÂN CHUYỂN",

    "Theo dõi hàng hóa trong trạng thái In-Transit, vị trí di chuyển và hỗ trợ đối soát khi hàng được chuyển giữa các kho.",
  ],

  [
    "QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN",

    "Phân quyền truy cập theo vai trò, hỗ trợ quản lý người dùng và kiểm soát hoạt động trong hệ thống.",
  ],
]

function industryPage(kind: "mom" | "cosmetics"): SitePage {
  const mom = kind === "mom"

  const label = mom ? "Mẹ & Bé" : "Mỹ phẩm & Chăm sóc cá nhân"

  const solution: {
    eyebrow: string

    title: string

    description: string

    cards: [string, string][]
  } = mom
    ? {
        eyebrow: "GIẢI PHÁP QUẢN LÝ NGÀNH MẸ & BÉ",

        title: "Quản lý kho Mẹ & Bé trực quan và chính xác hơn",

        description:
          "Đặc thù sản phẩm đa dạng, nhiều quy cách và yêu cầu kiểm soát lô, hạn sử dụng khiến việc tìm kiếm và quản lý hàng hóa trong kho cần được tổ chức rõ ràng từ vị trí lưu trữ.\n\nWareMap giúp doanh nghiệp Mẹ & Bé kết nối dữ liệu hàng hóa với vị trí thực tế, hỗ trợ nhân viên tìm đúng hàng và người quản lý kiểm soát kho hiệu quả hơn.",

        cards: [],
      }
    : {
        eyebrow: "GIẢI PHÁP QUẢN LÝ KHO NGÀNH MỸ PHẨM & CHĂM SÓC CÁ NHÂN",

        title:
          "Quản lý kho Mỹ phẩm & Chăm sóc cá nhân trực quan và chính xác hơn",

        description:
          "Đặc thù sản phẩm đa dạng, nhiều quy cách và yêu cầu kiểm soát lô, hạn sử dụng khiến việc tìm kiếm và quản lý hàng hóa trong kho cần được tổ chức rõ ràng từ vị trí lưu trữ.\n\nWareMap giúp doanh nghiệp Mỹ phẩm & Chăm sóc cá nhân kết nối dữ liệu hàng hóa với vị trí thực tế, hỗ trợ nhân viên tìm đúng hàng và người quản lý kiểm soát kho hiệu quả hơn.",

        cards: [],
      }

  const needs: {
    eyebrow: string
    cards: [string, string][]
  } = mom
    ? {
        eyebrow: "ĐẶC THÙ NGÀNH MẸ & BÉ",

        cards: [
          [
            "NHIỀU NHÓM SẢN PHẨM",
            "Từ sữa, thực phẩm, bỉm tã đến đồ dùng cho mẹ và bé, mỗi nhóm sản phẩm có quy cách và cách lưu trữ khác nhau.",
          ],

          [
            "NHIỀU BIẾN THỂ & QUY CÁCH",
            "Sản phẩm có thể khác nhau về độ tuổi, kích thước, dung tích hoặc phiên bản, dễ gây nhầm lẫn khi tìm và lấy hàng.",
          ],

          [
            "KIỂM SOÁT LÔ & HẠN SỬ DỤNG",
            "Một số nhóm hàng cần được theo dõi theo từng lô và hạn sử dụng trong suốt quá trình lưu trữ và xuất kho.",
          ],

          [
            "NHIỀU KHO & ĐIỂM LƯU TRỮ",
            "Khi doanh nghiệp mở rộng từ nhiều kho hoặc điểm bán, việc xác định hàng đang nằm ở đâu và đang được luân chuyển như thế nào trở nên phức tạp hơn.",
          ],
        ],
      }
    : {
        eyebrow: "ĐẶC THÙ NGÀNH MỸ PHẨM & CHĂM SÓC CÁ NHÂN",

        cards: [
          [
            "NHIỀU NHÓM SẢN PHẨM",
            "Từ chăm sóc da, trang điểm đến chăm sóc tóc, cơ thể và vệ sinh cá nhân, mỗi nhóm sản phẩm có đặc điểm và cách lưu trữ khác nhau.",
          ],

          [
            "NHIỀU BIẾN THỂ & QUY CÁCH",
            "Sản phẩm có thể khác nhau về dung tích, mùi hương, phiên bản hoặc dòng sản phẩm, dễ gây nhầm lẫn khi tìm kiếm và lấy hàng.",
          ],

          [
            "KIỂM SOÁT LÔ & HẠN SỬ DỤNG",
            "Nhiều sản phẩm cần được theo dõi theo từng lô và hạn sử dụng trong quá trình lưu trữ, kiểm kê và xuất kho.",
          ],

          [
            "NHIỀU KHO & ĐIỂM LƯU TRỮ",
            "Khi doanh nghiệp mở rộng từ nhiều kho hoặc cửa hàng, việc xác định hàng đang nằm ở đâu và đang được luân chuyển như thế nào trở nên phức tạp hơn.",
          ],
        ],
      }

  const industryFeatures: {
    eyebrow: string
    description: string
    cards: [string, string][]
  } = mom
    ? {
        eyebrow: "WAREMAP DÀNH CHO MẸ & BÉ",

        description:
          "WareMap tập trung vào những nhu cầu vận hành quan trọng của ngành Mẹ & Bé, từ tìm kiếm sản phẩm đến kiểm soát hạn sử dụng và luân chuyển hàng hóa.",

        cards: [
          [
            "TÌM ĐÚNG HÀNG, ĐÚNG VỊ TRÍ",
            "Tìm kiếm sản phẩm và xác định vị trí lưu trữ trực tiếp trên bản đồ kho 3D, từ khu vực, kệ, tầng đến ô lưu trữ.",
          ],

          [
            "KIỂM SOÁT LÔ & HẠN SỬ DỤNG",
            "Giám sát thông tin lô hàng và hạn sử dụng của từng sản phẩm, hỗ trợ theo dõi và ưu tiên xử lý phù hợp.",
          ],

          [
            "HỖ TRỢ XUẤT HÀNG THEO FEFO",
            "Theo dõi hạn sử dụng và hỗ trợ ưu tiên xuất hàng theo nguyên tắc FEFO, giúp hạn chế tồn đọng các sản phẩm có thời hạn sử dụng ngắn hơn.",
          ],

          [
            "THEO DÕI HÀNG HÓA GIỮA CÁC KHO",
            "Theo dõi vị trí và trạng thái hàng hóa khi được luân chuyển giữa kho, cửa hàng và các điểm lưu trữ.",
          ],
        ],
      }
    : {
        eyebrow: "WAREMAP DÀNH CHO MỸ PHẨM & CHĂM SÓC CÁ NHÂN",

        description:
          "WareMap tập trung vào những nhu cầu vận hành quan trọng của ngành Mỹ phẩm & Chăm sóc cá nhân, từ tìm kiếm sản phẩm đến kiểm soát hạn sử dụng và luân chuyển hàng hóa.",

        cards: [
          [
            "TÌM ĐÚNG HÀNG, ĐÚNG VỊ TRÍ",
            "Tìm kiếm sản phẩm và xác định vị trí lưu trữ trực tiếp trên bản đồ kho 3D, từ khu vực, kệ, tầng đến ô lưu trữ.",
          ],

          [
            "KIỂM SOÁT LÔ & HẠN SỬ DỤNG",
            "Giám sát thông tin lô hàng và hạn sử dụng của từng sản phẩm, hỗ trợ theo dõi và ưu tiên xử lý phù hợp.",
          ],

          [
            "HỖ TRỢ XUẤT HÀNG THEO FEFO",
            "Theo dõi hạn sử dụng và hỗ trợ ưu tiên xuất hàng theo nguyên tắc FEFO, giúp hạn chế tồn đọng các sản phẩm có thời hạn sử dụng ngắn hơn.",
          ],

          [
            "THEO DÕI HÀNG HÓA GIỮA CÁC KHO",
            "Theo dõi vị trí và trạng thái hàng hóa khi được luân chuyển giữa kho, cửa hàng và các điểm lưu trữ.",
          ],
        ],
      }

  const industryValue: {
    title: string
    cards: [string, string][]
  } = {
    title: "Hỗ trợ nhân viên và người quản lý trong từng bước vận hành",

    cards: [
      [
        "TÌM HÀNG NHANH HƠN",
        "Nhân viên có thể xác định vị trí sản phẩm trên hệ thống thay vì phụ thuộc hoàn toàn vào việc ghi nhớ layout kho.",
      ],

      [
        "GIẢM SAI SÓT KHI LẤY HÀNG",
        "Thông tin sản phẩm, vị trí và lô hàng được kết nối, hỗ trợ nhân viên kiểm tra trước khi lấy hàng.",
      ],

      [
        "KIỂM SOÁT HSD TỐT HƠN",
        "Dễ dàng theo dõi hạn sử dụng, hỗ trợ phát hiện sản phẩm cần được xử lý.",
      ],

      [
        "DỄ QUẢN LÝ KHI MỞ RỘNG",
        "Người quản lý có thể theo dõi vị trí và tình trạng hàng hóa tại nhiều khu vực hoặc kho khác nhau.",
      ],
    ],
  }

  return {
    label,

    eyebrow: `GIẢI PHÁP CHO NGÀNH ${label.toLocaleUpperCase("vi")}`,

    title: `Quản lý kho ${label} trực quan và chính xác hơn`,

    description:
      "Đa dạng sản phẩm trong một kho hàng? Biết chính xác từng mặt hàng ở đâu, còn bao nhiêu và lô nào cần được ưu tiên.",

    image: "",

    imageAlt: `Minh họa kho ${label}`,

    sections: [
      section(
        "industry-solution",

        "split",

        solution.eyebrow,

        solution.title,

        solution.description,

        solution.cards,
      ),

      section(
        "industry-needs",

        "cards",

        needs.eyebrow,

        "Danh mục đa dạng, yêu cầu kiểm soát hàng hóa chặt chẽ",

        "",

        needs.cards,
      ),

      section(
        "categories",

        "categories",

        "DANH MỤC SẢN PHẨM",

        `Quản lý đa dạng nhóm sản phẩm trong ngành ${label}`,

        "Một cách sắp xếp phù hợp cho từng loại hàng hóa.",

        mom
          ? [
              ["Sữa & dinh dưỡng", "Sữa bột · sữa nước · thực phẩm bổ sung"],

              ["Bỉm & vệ sinh", "Bỉm tã · khăn ướt · đồ vệ sinh"],

              ["Chăm sóc mẹ & bé", "Sữa tắm · dầu gội · chăm sóc da"],

              ["Đồ dùng cho bé", "Bình sữa · dụng cụ ăn dặm"],

              ["Đồ chơi & phát triển", "Đồ chơi · sách · học cụ"],

              ["Thời trang & phụ kiện", "Quần áo · giày dép · phụ kiện"],
            ]
          : [
              ["Chăm sóc da", "Sữa rửa mặt · toner · serum · kem dưỡng"],

              ["Trang điểm", "Son môi · phấn nền · phấn mắt"],

              ["Chăm sóc tóc", "Dầu gội · dầu xả · dưỡng tóc"],

              ["Chăm sóc cơ thể", "Sữa tắm · dưỡng thể · chống nắng"],

              ["Vệ sinh cá nhân", "Chăm sóc răng miệng · vệ sinh"],

              ["Nước hoa & sản phẩm khác", "Nước hoa · bộ quà tặng · phụ kiện"],
            ],
      ),

      section(
        "industry-features",

        "features",

        industryFeatures.eyebrow,

        "Quản lý hàng hóa theo vị trí, lô và hạn sử dụng",

        industryFeatures.description,

        industryFeatures.cards,
      ),

      section(
        "industry-value",

        "cards",

        "WAREMAP MANG LẠI GÌ?",

        industryValue.title,

        "",

        industryValue.cards,
      ),

      cta(),
    ],
  }
}

const home: SitePage = {
  label: "Trang chủ",

  eyebrow: "WAREMAP · KHÔNG GIAN KHO, RÕ TRONG TẦM TAY",

  title: "Phần mềm quản lý kho 3D và định vị hàng hóa thông minh",

  description:
    "Trực quan hóa kho hàng 3D, giúp dễ dàng quản lý vị trí và tìm kiếm sản phẩm nhanh chóng.",

  image: "",

  imageAlt: "Không gian kho 3D và vị trí hàng hóa trên WareMap",

  sections: [
    section(
      "challenges",

      "cards",

      "Thách thức trong quản lý kho",

      "Bạn có đang gặp khó khăn khi quản lý kho hàng?",

      "Việc quản lý và tìm kiếm hàng hóa trở nên khó khăn hơn khi quy mô kho ngày càng mở rộng.",

      [
        [
          "KHÓ XÁC ĐỊNH VỊ TRÍ",

          "Mất thời gian xác định chính xác vị trí lưu trữ của hàng hóa trong kho.",
        ],

        [
          "PHỤ THUỘC VÀO KINH NGHIỆM",

          "Việc tìm kiếm và xử lý hàng hóa phụ thuộc nhiều vào kinh nghiệm của nhân viên.",
        ],

        [
          "KHÓ KIỂM SOÁT HSD & LÔ HÀNG",

          "Khó theo dõi hạn sử dụng, phân biệt lô hàng và đảm bảo ưu tiên xuất hàng phù hợp.",
        ],

        [
          "KHÓ KIỂM SOÁT NHIỀU KHO",

          "Khó theo dõi vị trí, tồn kho và lịch sử luân chuyển hàng hóa giữa các kho.",
        ],
      ],
    ),

    section(
      "warehouse-solution",

      "features",

      "GIẢI PHÁP QUẢN LÝ KHO",

      "WareMap – Giải pháp quản lý kho trực quan với công nghệ 3D",

      "WareMap giúp doanh nghiệp dễ dàng theo dõi vị trí hàng hóa, quản lý không gian kho và nâng cao hiệu quả vận hành.",

      [
        [
          "ĐỊNH VỊ HÀNG HÓA",

          "Xác định chính xác vị trí hàng hóa trên bản đồ 3D, từ khu vực, kệ, tầng và ô lưu trữ.",
        ],

        [
          "TRỰC QUAN HÓA KHO",

          "Mô phỏng không gian kho trên nền tảng 3D, giúp nhân viên dễ dàng quan sát và nắm bắt layout kho.",
        ],

        [
          "KIỂM SOÁT HSD & LÔ HÀNG",

          "Quản lý thông tin lô hàng và hạn sử dụng, hỗ trợ theo dõi và ưu tiên xử lý hàng hóa phù hợp.",
        ],

        [
          "THEO DÕI LUÂN CHUYỂN",

          "Theo dõi vị trí và quá trình luân chuyển hàng hóa giữa các khu vực, kho và điểm lưu trữ.",
        ],
      ],
    ),

    section(
      "features",

      "features",

      "TÍNH NĂNG NỔI BẬT",

      "Công cụ quản lý kho được thiết kế cho vận hành thực tế",

      "",

      features,
    ),

    section(
      "pricing",

      "pricing",

      "BẢNG GIÁ DỊCH VỤ WAREMAP",

      "Giải pháp quản lý kho 3D phù hợp với quy mô của bạn",

      "Bắt đầu với một cửa hàng, dễ dàng mở rộng khi doanh nghiệp phát triển.",

      [
        ["Dùng thử miễn phí", "Trải nghiệm WareMap trước khi đăng ký."],

        ["Đơn lẻ", "Dành cho cửa hàng có 1 cơ sở."],

        [
          "Gói Chuỗi",
          "Toàn bộ tính năng gói Đơn lẻ, hỗ trợ tối đa 5 cơ sở và có thể mở rộng.",
        ],
      ],
    ),

    section(
      "support",

      "support",

      "",

      "WareMap luôn đồng hành cùng bạn trong suốt quá trình sử dụng",

      "",

      [
        [
          "Hướng dẫn sử dụng",

          "Tài liệu hướng dẫn giúp đội ngũ nhanh chóng làm quen với hệ thống và các tính năng quản lý kho.",
        ],

        [
          "Hỗ trợ trực tuyến",

          "Tiếp nhận và hỗ trợ các vấn đề phát sinh trong quá trình sử dụng WareMap.",
        ],

        [
          "Tư vấn & triển khai",

          "Hỗ trợ thiết lập dữ liệu, xây dựng bản đồ kho và đưa hệ thống vào vận hành phù hợp với nhu cầu doanh nghiệp.",
        ],
      ],
    ),

    section("faq", "faq", "GIẢI ĐÁP THẮC MẮC", "Các câu hỏi thường gặp", "", [
      [
        "WareMap có phù hợp với cửa hàng nhỏ không?",

        "Có. Bạn có thể bắt đầu từ một cơ sở và sơ đồ kho đơn giản, sau đó mở rộng theo nhu cầu.",
      ],

      [
        "Có cần biết thiết kế 3D để dựng kho không?",

        "Không. Thêm kệ có sẵn, di chuyển, chỉnh kích thước và lưu theo mặt bằng thực tế.",
      ],

      [
        "Làm thế nào để tìm đúng sản phẩm trong kho?",

        "Tìm tên hoặc mã sản phẩm, sau đó xem vị trí Kệ – Tầng – Ô trên bản đồ 3D.",
      ],

      [
        "Có thể phân quyền riêng cho nhân viên không?",

        "Có. Bản demo có các vai trò Chủ doanh nghiệp, Quản lý kho, Nhân viên kho và Bán hàng.",
      ],

      [
        "Dữ liệu demo có đồng bộ giữa các thiết bị không?",

        "Hiện tại dữ liệu demo lưu riêng trên trình duyệt. Đồng bộ nhiều người cần backend và xác thực khi triển khai thực tế.",
      ],
    ]),

    cta(),
  ],
}

const solution: SitePage = {
  label: "Giới thiệu",

  eyebrow: "GIỚI THIỆU WAREMAP",

  title: "Quản lý kho trực quan hơn với bản đồ 3D",

  description:
    "WareMap là phần mềm quản lý kho 3D và định vị hàng hóa, giúp kết nối dữ liệu hàng hóa với vị trí lưu trữ thực tế trong kho. Thay vì chỉ theo dõi số lượng tồn kho, WareMap giúp người dùng xác định hàng hóa đang nằm ở đâu, từ khu vực, kệ, tầng đến vị trí lưu trữ cụ thể.",

  image: "",

  imageAlt: "Bản đồ kho trực quan WareMap",

  sections: [
    section(
      "what-is-waremap",

      "split",

      "WAREMAP LÀ GÌ?",

      "Phần mềm quản lý kho gắn dữ liệu với vị trí thực tế",

      "WareMap được phát triển để trực quan hóa không gian kho và gắn thông tin hàng hóa với từng vị trí lưu trữ trên bản đồ 3D.\n\nNgười dùng có thể theo dõi vị trí hàng hóa, tìm kiếm sản phẩm và quản lý thông tin liên quan đến lô hàng, hạn sử dụng và quá trình luân chuyển.\n\nWareMap tập trung vào một khoảng trống trong quản lý kho hiện nay: kết nối dữ liệu trên hệ thống với vị trí thực tế của hàng hóa trong kho.",
    ),

    section(
      "solution-problems",

      "features",

      "WAREMAP RA ĐỜI ĐỂ GIẢI QUYẾT VẤN ĐỀ GÌ?",

      "Biết hàng còn tồn chưa đủ — cần biết hàng nằm ở đâu",

      "Trong thực tế, doanh nghiệp có thể sử dụng Excel, phần mềm bán hàng hoặc phần mềm quản lý tồn kho để theo dõi số lượng hàng hóa. Tuy nhiên, thông tin về vị trí lưu trữ thực tế thường vẫn phụ thuộc vào layout kho và kinh nghiệm của nhân viên.\n\nKhi số lượng sản phẩm, vị trí lưu trữ và số lượng kho tăng lên, việc tìm kiếm và kiểm soát hàng hóa trở nên khó khăn hơn.",

      [
        [
          "DỮ LIỆU HÀNG HÓA",

          "Thông tin hàng hóa, số lượng, lô hàng, hạn sử dụng,...",
        ],

        [
          "VỊ TRÍ LƯU TRỮ THỰC TẾ",

          "Khu vực, kệ, tầng và ô lưu trữ trong kho.",
        ],

        [
          "BẢN ĐỒ KHO TRỰC QUAN",

          "Mô phỏng không gian kho 3D, dễ dàng quan sát và quản lý.",
        ],

        [
          "TÌM KIẾM VÀ VẬN HÀNH CHÍNH XÁC HƠN",

          "Nhanh chóng tìm đúng hàng, hạn chế sai sót, nâng cao hiệu quả vận hành.",
        ],
      ],
    ),

    section(
      "solution-value",

      "cards",

      "GIÁ TRỊ WAREMAP MANG LẠI",

      "Tìm đúng hàng, đúng vị trí, vận hành hiệu quả hơn",

      "WareMap giúp nhân viên nhanh chóng xác định vị trí hàng hóa trên bản đồ kho, giảm thời gian tìm kiếm và hạn chế sai sót trong quá trình lấy hàng.\n\nĐối với người quản lý, WareMap cung cấp góc nhìn trực quan về vị trí và tình trạng hàng hóa, hỗ trợ kiểm soát lô hàng, hạn sử dụng và quá trình luân chuyển giữa các kho.",

      [
        [
          "TÌM HÀNG NHANH HƠN",

          "Xác định vị trí hàng hóa trực tiếp trên bản đồ kho, giảm thời gian tìm kiếm và phụ thuộc vào kinh nghiệm nhân viên.",
        ],

        [
          "GIẢM SAI SÓT",

          "Hỗ trợ xác định đúng sản phẩm, đúng vị trí và hạn chế nhầm lẫn trong quá trình lấy và sắp xếp hàng hóa.",
        ],

        [
          "KIỂM SOÁT HẠN SỬ DỤNG TỐT HƠN",

          "Theo dõi vị trí, lô hàng và hạn sử dụng để hỗ trợ kiểm soát hàng hóa trong quá trình vận hành.",
        ],

        [
          "DỄ QUẢN LÝ KHI MỞ RỘNG",

          "Hỗ trợ quản lý nhiều kho và điểm lưu trữ trên cùng một hệ thống, giúp doanh nghiệp dễ dàng kiểm soát khi quy mô tăng lên.",
        ],
      ],
    ),

    cta(),
  ],
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  version: 1,

  ctaLabel: "Dùng thử miễn phí",

  footerDescription:
    "Phần mềm quản lý kho 3D và định vị hàng hóa thông minh. Đồng hành cùng đội ngũ vận hành, từ một cửa hàng đến nhiều cơ sở.",

  contactEmail: "",

  pages: {
    home,

    solution,

    mom: industryPage("mom"),

    cosmetics: industryPage("cosmetics"),
  },
}

export const PUBLIC_PAGE_ORDER: PublicPage[] = [
  "home",

  "solution",

  "mom",

  "cosmetics",
]
