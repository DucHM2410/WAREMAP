import { Building2, Check, Users } from "lucide-react"

import { useState } from "react"

import { money, policy } from "../../app/model"

import type { ContentSection } from "../site-content/types"

const trialFeatures = [
  "1 cơ sở",
  "1 tài khoản quản trị",
  "Quản lý tồn kho, tra cứu vị trí",
  "Bản đồ kho 3D cơ bản",
  "Thử một số tính năng nâng cao",
]

const singleFeatures = [
  "1 quản trị + 3 nhân viên",
  "3D Builder",
  "QR Kệ + QR Lô",
  "Quản lý lô và hạn sử dụng",
  "Xuất kho theo FEFO",
  "Cảnh báo Zalo OA",
  "Phân quyền nhân viên",
]

const chainFeatures = [
  "Tối đa 5 cơ sở",
  "Chuyển kho nội bộ",
  "Đối soát giữa các chi nhánh",
  "3 quản trị + 15 nhân viên",
  "Theo dõi hàng đang vận chuyển",
  "Mở rộng bằng Block cơ sở",
]

const SINGLE_PRICE = policy.single
const CHAIN_PRICE = policy.chain
const BRANCH_BLOCK_PRICE = policy.branchBlock
const ACCOUNT_BLOCK_PRICE = policy.accountBlock

function PlanFeatures({ items }: { items: string[] }) {
  return (
    <ul className="wm-pricing-features">
      {items.map((item) => (
        <li key={item}>
          <Check size={15} strokeWidth={2.4} />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function PricingSection({
  section: s,
  onRegister,
  onTrial,
}: {
  section: ContentSection
  onRegister: (plan?: "free" | "single" | "chain") => void
  onTrial: () => void
}) {
  const [plan, setPlan] = useState<"single" | "chain">("chain")

  const [locations, setLocations] = useState(5)

  const [extraAccounts, setExtraAccounts] = useState(0)

  const trialInfo = s.cards[0]

  const singleInfo = s.cards[1]

  const chainInfo = s.cards[2]

  const basePrice = plan === "single" ? SINGLE_PRICE : CHAIN_PRICE

  const branchBlocks =
    plan === "chain" ? Math.ceil(Math.max(0, locations - 5) / 2) : 0

  const branchCost = branchBlocks * BRANCH_BLOCK_PRICE

  const accountBlocks = Math.ceil(extraAccounts / 2)

  const accountCost = accountBlocks * ACCOUNT_BLOCK_PRICE

  const periodicCost = basePrice + branchCost

  const firstMonthCost = periodicCost + accountCost

  const locationMax = plan === "single" ? 1 : 20

  const locationFill =
    plan === "single" ? 100 : ((locations - 1) / (locationMax - 1)) * 100

  const accountFill = (extraAccounts / 20) * 100

  const changePlan = (next: "single" | "chain") => {
    setPlan(next)

    setLocations(next === "single" ? 1 : 5)
  }

  return (
    <section id={s.id} className="wm-section wm-pricing wm-pricing-v2">
      <div className="wm-pricing-hero">
        {s.eyebrow && <span className="wm-eyebrow">{s.eyebrow}</span>}
        <h2>{s.title}</h2>
        {s.description && <p>{s.description}</p>}
        <span className="wm-pricing-trial-badge">Dùng thử miễn phí 7 ngày</span>
      </div>

      <div className="wm-pricing-plans">
        <article className="wm-pricing-card">
          <h3>{trialInfo?.title || "Dùng thử miễn phí"}</h3>
          <p>{trialInfo?.text || "Trải nghiệm WareMap trước khi đăng ký."}</p>
          <div className="wm-pricing-price">
            {money(0)}
            <small>/7 ngày</small>
          </div>
          <div className="wm-pricing-card-divider" />
          <PlanFeatures items={trialFeatures} />
          <button
            type="button"
            className="wm-btn wm-btn-outline"
            onClick={onTrial}
          >
            Dùng thử miễn phí
          </button>
        </article>

        <article className="wm-pricing-card">
          <h3>{singleInfo?.title || "Đơn lẻ"}</h3>
          <p>{singleInfo?.text || "Dành cho cửa hàng có 1 cơ sở."}</p>
          <div className="wm-pricing-price">
            {money(SINGLE_PRICE)}
            <small>/tháng</small>
          </div>
          <div className="wm-pricing-card-divider" />
          <PlanFeatures items={singleFeatures} />
          <button
            type="button"
            className="wm-btn wm-btn-dark"
            onClick={() => onRegister("single")}
          >
            Chọn gói Đơn lẻ
          </button>
        </article>
      </div>

      <article className="wm-pricing-chain">
        <div className="wm-pricing-chain-head">
          <h3>{chainInfo?.title || "Gói Chuỗi"}</h3>
          <span>Dành cho doanh nghiệp nhiều cơ sở</span>
        </div>
        <div className="wm-pricing-chain-price">
          {money(CHAIN_PRICE)}
          <small>/tháng</small>
        </div>
        <p>
          {chainInfo?.text ||
            "Toàn bộ tính năng gói Đơn lẻ, hỗ trợ tối đa 5 cơ sở và có thể mở rộng."}
        </p>
        <ul className="wm-pricing-chain-features">
          {chainFeatures.map((item) => (
            <li key={item}>
              <Check size={15} strokeWidth={2.4} />
              {item}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="wm-btn wm-btn-white"
          onClick={() => onRegister("chain")}
        >
          Chọn gói Chuỗi
        </button>
      </article>

      <div className="wm-pricing-expand">
        <div className="wm-pricing-expand-head">
          <h3>Mở rộng linh hoạt theo nhu cầu</h3>
          <p>Chỉ trả thêm khi doanh nghiệp cần mở rộng quy mô.</p>
        </div>
        <div className="wm-pricing-blocks">
          <article>
            <span className="wm-pricing-block-icon">
              <Building2 size={19} />
            </span>
            <h3>Block cơ sở</h3>
            <div className="wm-pricing-block-price">
              {money(BRANCH_BLOCK_PRICE)}
              <small>/tháng/Block</small>
            </div>
            <p>Thêm tối đa 2 cơ sở cho mỗi Block.</p>
            <span className="wm-pricing-block-note">
              Chỉ áp dụng cho gói Chuỗi.
            </span>
          </article>
          <article>
            <span className="wm-pricing-block-icon">
              <Users size={19} />
            </span>
            <h3>Block tài khoản</h3>
            <div className="wm-pricing-block-price">
              {money(ACCOUNT_BLOCK_PRICE)}
              <small>/Block, thanh toán một lần</small>
            </div>
            <p>Thêm 2 tài khoản cho mỗi Block.</p>
          </article>
        </div>
      </div>

      <section
        className="wm-pricing-calculator"
        aria-labelledby="wm-pricing-calculator-title"
      >
        <h3 id="wm-pricing-calculator-title">Ước tính chi phí WareMap</h3>
        <p className="wm-pricing-calculator-desc">
          Tùy chỉnh số lượng cơ sở và tài khoản bổ sung để dự tính ngân sách.
        </p>

        <div
          className="wm-pricing-switch"
          role="group"
          aria-label="Chọn gói để ước tính"
        >
          <button
            type="button"
            className={plan === "single" ? "active" : ""}
            aria-pressed={plan === "single"}
            onClick={() => changePlan("single")}
          >
            Đơn lẻ
          </button>
          <button
            type="button"
            className={plan === "chain" ? "active" : ""}
            aria-pressed={plan === "chain"}
            onClick={() => changePlan("chain")}
          >
            Chuỗi
          </button>
        </div>

        <div className="wm-pricing-control">
          <div className="wm-pricing-control-head">
            <span>Số cơ sở</span>
            <b>{locations}</b>
          </div>
          <input
            type="range"
            min={1}
            max={locationMax}
            step={1}
            value={locations}
            disabled={plan === "single"}
            aria-label="Số cơ sở"
            style={{
              background: `linear-gradient(to right,#D8E9FF 0 ${locationFill}%,#E9F0F8 ${locationFill}% 100%)`,
            }}
            onChange={(event) => setLocations(Number(event.target.value))}
          />
        </div>

        <div className="wm-pricing-control">
          <div className="wm-pricing-control-head">
            <span>Tài khoản bổ sung</span>
            <b>{extraAccounts}</b>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={extraAccounts}
            aria-label="Tài khoản bổ sung"
            style={{
              background: `linear-gradient(to right,#D8E9FF 0 ${accountFill}%,#E9F0F8 ${accountFill}% 100%)`,
            }}
            onChange={(event) => setExtraAccounts(Number(event.target.value))}
          />
          <p className="wm-pricing-included">
            Đã bao gồm:{" "}
            {plan === "single"
              ? "1 quản trị + 3 nhân viên."
              : "3 quản trị + 15 nhân viên."}
          </p>
        </div>

        <div className="wm-pricing-breakdown">
          <div>
            <span>Phí gói cơ bản</span>
            <b>{money(basePrice)}/tháng</b>
          </div>
          <div>
            <span>Block cơ sở ({branchBlocks})</span>
            <b>{money(branchCost)}/tháng</b>
          </div>
          <div>
            <span>Block tài khoản ({accountBlocks})</span>
            <b>{money(accountCost)} một lần</b>
          </div>
        </div>

        <div className="wm-pricing-summary">
          <div className="wm-pricing-total">
            <span>Tổng phí định kỳ dự kiến</span>
            <strong>
              {money(periodicCost)}
              <small>/tháng</small>
            </strong>
            <p>Phí mua thêm tài khoản một lần: {money(accountCost)}</p>
          </div>
          <div className="wm-pricing-first-month">
            <span>Thanh toán tháng đầu dự kiến</span>
            <b>{money(firstMonthCost)}</b>
          </div>
        </div>

        <p className="wm-pricing-disclaimer">
          Chi phí minh họa chưa bao gồm thuế hoặc các khoản phát sinh khác (nếu
          có). Block cơ sở chỉ dành cho gói Chuỗi; Block tài khoản được tính
          theo số tài khoản mua thêm ngoài hạn mức của gói.
        </p>
      </section>
    </section>
  )
}
