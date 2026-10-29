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
    "BẮT ĐẦU CÙNG WAREMAP",
    "Một kho ngăn nắp. Một đội ngũ chủ động.",
    "Trải nghiệm quản lý kho 3D, theo dõi vị trí và hạn dùng trên cùng một nền tảng.",
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
        `GIẢI PHÁP QUẢN LÝ KHO NGÀNH ${label.toLocaleUpperCase("vi")}`,
        `Hiểu từng vị trí. Chủ động từng lô hàng.`,
        "Một bản đồ chung cho cả đội: tìm kiếm vị trí, theo dõi hạn dùng và xác minh hàng hóa trong kho của bạn.",
        [
          ["Vị trí rõ ràng", "Kệ – Tầng – Ô được thể hiện trực quan."],
          [
            "Thao tác nhất quán",
            "Cả đội cùng dùng một cách định vị và xác minh.",
          ],
        ],
      ),
      section(
        "industry-needs",
        "cards",
        "ĐẶC THÙ NGÀNH HÀNG",
        "Danh mục đa dạng, yêu cầu kiểm soát hàng hóa chặt chẽ",
        "",
        [
          [
            "Nhiều nhóm sản phẩm",
            "Theo dõi rõ từng nhóm hàng và đặc tính bảo quản.",
          ],
          [
            "Nhiều biến thể & quy cách",
            "Phân biệt dung tích, kích cỡ, màu sắc và quy cách đóng gói.",
          ],
          [
            "Kiểm soát lô & hạn sử dụng",
            "Biết lô nào cần ưu tiên xuất trước theo FEFO.",
          ],
          [
            "Nhiều kho & điểm lưu trữ",
            "Tra cứu tồn và vị trí theo từng cơ sở được phân quyền.",
          ],
        ],
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
        "WAREMAP ĐỒNG HÀNH CÙNG BẠN",
        "Quản lý hàng hóa theo vị trí, lô và hạn sử dụng",
        "Từ một cửa hàng đến nhiều cơ sở, luôn có thông tin để đưa ra quyết định rõ ràng.",
        [
          [
            "Tìm đúng hàng, đúng vị trí",
            "Tra cứu nhanh sản phẩm trên bản đồ 3D.",
          ],
          [
            "Kiểm soát lô & hạn sử dụng",
            "Chủ động kiểm tra những lô cần chú ý.",
          ],
          ["Hỗ trợ xuất hàng theo FEFO", "Ưu tiên lô có hạn dùng sớm hơn."],
          ["Theo dõi hàng hóa giữa các kho", "Đối soát số lượng gửi và nhận."],
        ],
      ),
      section(
        "industry-value",
        "cards",
        "WAREMAP MANG LẠI GÌ?",
        "Hỗ trợ cả đội trong từng bước vận hành",
        "",
        [
          [
            "Tìm hàng nhanh hơn",
            "Nhân viên mới dễ làm quen với cách sắp xếp trong kho.",
          ],
          [
            "Giảm sai sót khi lấy hàng",
            "Tra cứu vị trí và xác minh trước khi thao tác.",
          ],
          [
            "Kiểm soát tốt tồn kho",
            "Theo dõi số lượng, vị trí và tình trạng lô hàng.",
          ],
          [
            "Dễ quản lý khi mở rộng",
            "Một cách vận hành nhất quán giữa các cơ sở.",
          ],
        ],
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
      "CHI PHÍ LINH HOẠT",
      "Lựa chọn gói dịch vụ phù hợp với nhu cầu quản lý kho",
      "WareMap cung cấp các gói dịch vụ linh hoạt, đáp ứng nhu cầu sử dụng từ cơ bản đến mở rộng theo quy mô kho hàng.",
      [
        ["Miễn phí", "Khám phá kho mẫu và bản đồ 3D cơ bản."],
        ["Một cơ sở", "Cho cửa hàng cần quản lý kho và phân quyền đội ngũ."],
        ["Chuỗi", "Cho doanh nghiệp cần theo dõi nhiều cơ sở và chuyển kho."],
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
      "Nắm đúng số lượng là chưa đủ. Bạn còn cần biết từng mặt hàng đang ở đâu, thuộc lô nào và nên xử lý thế nào.",
      [
        ["Định vị rõ ràng", "Tra cứu vị trí theo Kệ – Tầng – Ô."],
        [
          "Thông tin liền mạch",
          "Kết nối vị trí, lô và hạn dùng trong một góc nhìn.",
        ],
      ],
    ),
    section(
      "solution-problems",
      "features",
      "WAREMAP RA ĐỜI ĐỂ GIẢI QUYẾT ĐIỀU GÌ?",
      "Biết hàng còn tồn chưa đủ — cần biết hàng nằm ở đâu",
      "Giảm thời gian tìm kiếm và sự phụ thuộc vào trí nhớ của từng nhân viên.",
      [
        ["Dễ tìm hàng hóa", "Tìm tên hàng, mã sản phẩm và vị trí."],
        ["Vị trí lưu trữ thực tế", "Kệ, tầng và ô được mô tả trực quan."],
        [
          "Bản đồ kho trực quan",
          "Dễ hình dung cách sắp xếp trong không gian 3D.",
        ],
        ["Tìm kiếm nhanh hơn", "Đưa thông tin cần thiết đến đúng người."],
      ],
    ),
    section(
      "solution-value",
      "cards",
      "GIÁ TRỊ WAREMAP MANG LẠI",
      "Tìm đúng hàng, đúng vị trí, vận hành hiệu quả hơn",
      "Một nền tảng để phối hợp công việc trong kho.",
      [
        [
          "Thông tin rõ ràng",
          "Biết hàng đang ở đâu, còn bao nhiêu và hạn dùng thế nào.",
        ],
        ["Dễ sử dụng", "Nhân viên mới làm quen từ bản đồ trực quan."],
        ["Kiểm soát chủ động", "Theo dõi lô hàng, cảnh báo và chuyển kho."],
        ["Dễ phát triển", "Bắt đầu từ một kho, mở rộng theo quy mô."],
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
