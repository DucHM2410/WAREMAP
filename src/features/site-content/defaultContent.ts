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
    "Bản đồ kho 3D",
    "Tái hiện kệ, tầng và ô hàng. Nhìn thấy vị trí, tìm đúng mặt hàng ngay trên bản đồ trực quan.",
  ],
  [
    "Định vị hàng hóa",
    "Tìm tên hoặc mã sản phẩm để biết hàng đang ở đâu, thuộc lô nào và còn bao nhiêu.",
  ],
  [
    "QR xác thực hai chiều",
    "Đối chiếu mã vị trí và mã lô trước khi nhập, xuất hoặc xác nhận hàng tại kho.",
  ],
  [
    "Quản lý HSD & FEFO",
    "Theo dõi lô cận hạn và ưu tiên hàng hết hạn trước, giúp đội ngũ chủ động xử lý.",
  ],
  [
    "Theo dõi luân chuyển",
    "Nắm rõ hàng đang đi đường, kho gửi, kho nhận và kết quả đối soát số lượng.",
  ],
  [
    "Quản lý người dùng & phân quyền",
    "Chủ doanh nghiệp, quản lý, nhân viên kho và bán hàng có không gian công việc riêng.",
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
      "THẤU HIỂU CÔNG VIỆC CỦA BẠN",
      "Bạn có đang gặp khó khăn khi quản lý kho hàng?",
      "Một mặt hàng ở sai vị trí có thể khiến cả quy trình chậm lại.",
      [
        [
          "Kho khó sắp xếp, dễ thất lạc",
          "Vị trí lưu trữ không rõ ràng, hàng hóa dễ bị bỏ quên hoặc xếp nhầm chỗ.",
        ],
        [
          "Mất thời gian tìm hàng",
          "Phụ thuộc trí nhớ của người quen kho, nhân viên mới khó bắt đầu.",
        ],
        [
          "Khó kiểm soát lô và hạn dùng",
          "Dễ bỏ sót hàng cận hạn khi số lượng mã hàng ngày càng tăng.",
        ],
        [
          "Khó đối soát nhiều cơ sở",
          "Hàng đã xuất nhưng chưa nhận, tồn kho giữa các điểm thiếu thống nhất.",
        ],
      ],
    ),
    section(
      "warehouse-solution",
      "features",
      "GIẢI PHÁP QUẢN LÝ KHO",
      "WareMap — Giải pháp quản lý kho trực quan với công nghệ 3D",
      "Biến vị trí trong kho thành thông tin rõ ràng để cả đội cùng làm việc.",
      [
        ["Định vị hàng hóa", "Tìm đúng sản phẩm theo Kệ – Tầng – Ô."],
        ["Trực quan hóa 3D", "Dựng lại không gian kho theo cách bạn vận hành."],
        [
          "Kiểm soát lô & hàng tồn",
          "Chủ động theo dõi vị trí, số lượng và hạn dùng.",
        ],
        ["Theo dõi luân chuyển", "Nắm rõ hành trình hàng giữa các cơ sở."],
      ],
    ),
    section(
      "features",
      "features",
      "TÍNH NĂNG NỔI BẬT",
      "Công cụ quản lý kho được thiết kế cho vận hành thực tế",
      "Từ thiết kế kho đến xác minh hàng hóa, mọi thao tác đều bắt đầu từ một vị trí rõ ràng.",
      features,
    ),
    section(
      "pricing",
      "pricing",
      "CHI PHÍ LINH HOẠT",
      "Lựa chọn gói dịch vụ phù hợp với nhu cầu quản lý kho",
      "Bắt đầu với kho mẫu, lựa chọn theo số cơ sở và mở rộng khi cần.",
      [
        ["Miễn phí", "Khám phá kho mẫu và bản đồ 3D cơ bản."],
        ["Một cơ sở", "Cho cửa hàng cần quản lý kho và phân quyền đội ngũ."],
        ["Chuỗi", "Cho doanh nghiệp cần theo dõi nhiều cơ sở và chuyển kho."],
      ],
    ),
    section(
      "support",
      "support",
      "LUÔN ĐỒNG HÀNH",
      "WareMap đồng hành cùng bạn trong quá trình sử dụng",
      "Từng bước rõ ràng để cả đội làm quen với cách quản lý kho mới.",
      [
        [
          "Hướng dẫn sử dụng",
          "Khám phá cách tạo sơ đồ, định vị hàng hóa và quét QR.",
        ],
        [
          "Hỗ trợ trực tuyến",
          "Gửi yêu cầu để được tư vấn cách áp dụng vào kho thực tế.",
        ],
        [
          "Tư vấn & triển khai",
          "Trao đổi về quy mô cơ sở, nhóm quyền và nhu cầu quản lý.",
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
    "WareMap giúp biến những vị trí khó nhớ thành thông tin rõ ràng. Từ tìm kiếm đến kiểm soát lô hàng, cả đội cùng làm việc trên một sơ đồ dễ hiểu.",
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
