
import Link from 'next/link';
// import './lp.css';

export default function Page() {
  return (
    <>
      
    {/*  ========================================
         1. Header (ヘッダー)
         ========================================  */}
    <header className="header" role="banner">
        <div className="header-container">
            <div className="header-logo">
                <a href="#" aria-label="今鷹医院 ホーム">
                    <img src="img/logo-main.png" alt="今鷹医院ロゴ" />
                </a>
            </div>
            
            <nav className="header-nav" role="navigation">
                <ul className="nav-menu">
                    <li><a href="#services">診療案内</a></li>
                    <li><a href="#features">当院の特徴</a></li>
                    <li><a href="#director">院長紹介</a></li>
                    <li><a href="#access">アクセス</a></li>
                    <li><a href="#faq">FAQ</a></li>
                </ul>
                
                <div className="header-cta">
                    <a href="/booking" className="btn btn-primary" aria-label="WEB予約 24時間受付">WEB予約</a>
                    <a href="tel:042-XXX-XXXX" className="btn btn-secondary" aria-label="電話で予約する">042-XXX-XXXX</a>
                </div>
            </nav>

            <button className="hamburger" aria-label="メニューを開く" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        {/*  Mobile Menu  */}
        <div className="mobile-menu" role="navigation" aria-hidden="true">
            <ul className="nav-menu">
                <li><a href="#services">診療案内</a></li>
                <li><a href="#features">当院の特徴</a></li>
                <li><a href="#director">院長紹介</a></li>
                <li><a href="#access">アクセス</a></li>
                <li><a href="#faq">FAQ</a></li>
            </ul>
            <div className="header-cta">
                <a href="/booking" className="btn btn-primary">WEB予約 24時間受付</a>
                <a href="tel:042-XXX-XXXX" className="btn btn-secondary">042-XXX-XXXX</a>
            </div>
        </div>
    </header>

    {/*  ========================================
         2. Hero Section (ヒーロー)
         ========================================  */}
    <section className="hero" role="banner">
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="hero-content">
            <h1 className="hero-title">地域に寄り添い、家族のように温かく<br />一人ひとりの健康を守ります</h1>
            <p className="hero-subtitle">小平市鷹の台で、循環器専門医による内科・循環器科の診療を提供しています。あなたとご家族の「かかりつけ医」として、丁寧で安心できる医療をお届けします。</p>
            
            <div className="hero-cta">
                <a href="/booking" className="btn btn-primary">WEB予約はこちら<br /><small style={{ fontSize: "13px" }}>24時間受付中</small></a>
                <a href="tel:042-XXX-XXXX" className="btn btn-secondary">お電話で相談<br /><small style={{ fontSize: "13px" }}>042-XXX-XXXX</small></a>
            </div>

            <div className="hero-badges">
                <div className="badge-item">
                    <img src="img/trust-badge-icon-01.png" alt="" className="badge-icon" aria-hidden="true" />
                    <span className="badge-text">循環器専門医<br />在籍</span>
                </div>
                <div className="badge-item">
                    <img src="img/trust-badge-icon-02.png" alt="" className="badge-icon" aria-hidden="true" />
                    <span className="badge-text">地域密着<br />20年の実績</span>
                </div>
                <div className="badge-item">
                    <img src="img/trust-badge-icon-03.png" alt="" className="badge-icon" aria-hidden="true" />
                    <span className="badge-text">駐車場<br />完備</span>
                </div>
                <div className="badge-item">
                    <img src="img/trust-badge-icon-04.png" alt="" className="badge-icon" aria-hidden="true" />
                    <span className="badge-text">WEB予約<br />対応</span>
                </div>
            </div>

            <div className="hero-scroll">
                <svg className="hero-scroll-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
                <span className="hero-scroll-text">下にスクロールして詳しく見る</span>
            </div>
        </div>
    </section>

    {/*  ========================================
         3. Emergency Section (緊急時対応)
         ========================================  */}
    <section className="section emergency" id="emergency">
        <div className="section-container">
            <h2 className="section-title">こんな症状はありませんか？</h2>
            <p className="section-subtitle">内科・循環器科の症状に幅広く対応しています。気になる症状がございましたらお気軽にご相談ください。</p>
            
            <div className="symptom-list">
                <div className="symptom-item">
                    <svg className="symptom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>発熱・風邪症状</span>
                </div>
                <div className="symptom-item">
                    <svg className="symptom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>胸痛・胸の圧迫感</span>
                </div>
                <div className="symptom-item">
                    <svg className="symptom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>動悸・不整脈</span>
                </div>
                <div className="symptom-item">
                    <svg className="symptom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>息切れ・呼吸困難</span>
                </div>
                <div className="symptom-item">
                    <svg className="symptom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>めまい・立ちくらみ</span>
                </div>
                <div className="symptom-item">
                    <svg className="symptom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>高血圧・高血糖</span>
                </div>
                <div className="symptom-item">
                    <svg className="symptom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>むくみ・だるさ</span>
                </div>
                <div className="symptom-item">
                    <svg className="symptom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>腹痛・胃腸症状</span>
                </div>
            </div>

            <div className="emergency-cta">
                <a href="tel:042-XXX-XXXX" className="btn btn-primary" style={{ fontSize: "18px", padding: "20px 48px" }}>
                    今すぐお電話ください<br />042-XXX-XXXX
                </a>
                <p className="emergency-note">※救急の場合は119番へお電話ください</p>
            </div>
        </div>
    </section>

    {/*  ========================================
         4. Trust Section (信頼・実績)
         ========================================  */}
    <section className="section" id="trust">
        <div className="section-container">
            <h2 className="section-title">信頼と実績</h2>
            <p className="section-subtitle">地域の皆様に支えられ、20年以上にわたり質の高い医療を提供してまいりました。</p>
            
            <div className="trust-stats">
                <div className="stat-item">
                    <div className="stat-number" data-count="12000">0</div>
                    <div className="stat-label">年間診療患者数</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number" data-count="20">0</div>
                    <div className="stat-label">地域診療実績(年)</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number" data-count="3">0</div>
                    <div className="stat-label">専門医・認定医在籍</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number" data-count="96">0</div>
                    <div className="stat-label">患者満足度(%)</div>
                </div>
            </div>

            <div className="trust-badges">
                <img src="img/certification-badge-01.png" alt="日本内科学会認定医" className="trust-badge" />
                <img src="img/certification-badge-02.png" alt="循環器専門医" className="trust-badge" />
            </div>
        </div>
    </section>

    {/*  ========================================
         5. Brand Story Section (ブランドストーリー)
         ========================================  */}
    <section className="section brand-story" id="brand-story">
        <div className="section-container">
            <h2 className="section-title">私たちの想い</h2>
            <div className="brand-content">
                <div className="brand-image">
                    <img src="img/brand-story-image.jpg" alt="今鷹医院のブランドストーリー" />
                </div>
                <div className="brand-text">
                    <h3>地域と共に歩む医療を目指して</h3>
                    <p>2004年の開業以来、今鷹医院は小平市鷹の台の地域医療を支え続けてまいりました。私たちが大切にしているのは、患者様一人ひとりに寄り添い、家族のような温かさで接することです。</p>
                    <p>高血圧、糖尿病、心臓病などの生活習慣病から、日常的な体調不良まで、幅広い症状に対応。予防から治療、そして生活指導まで、トータルでサポートいたします。</p>
                    <p>循環器専門医としての専門性と、かかりつけ医としての親しみやすさを兼ね備え、地域の皆様の健康を守り続けます。</p>
                    <div className="brand-values">
                        <span className="value-tag">
                            <svg className="value-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>
                            温かい
                        </span>
                        <span className="value-tag">
                            <svg className="value-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                            信頼
                        </span>
                        <span className="value-tag">
                            <svg className="value-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/></svg>
                            地域密着
                        </span>
                        <span className="value-tag">
                            <svg className="value-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
                            家族的
                        </span>
                        <span className="value-tag">
                            <svg className="value-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
                            丁寧
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  ========================================
         6. Services Section (診療案内)
         ========================================  */}
    <section className="section" id="services">
        <div className="section-container">
            <h2 className="section-title">診療案内</h2>
            <p className="section-subtitle">内科と循環器科の専門診療を行っています。お困りの症状に合わせて最適な治療をご提案いたします。</p>
            
            <div className="services-tabs">
                <button className="tab-button active" data-tab="internal">内科</button>
                <button className="tab-button" data-tab="cardiology">循環器科</button>
            </div>

            <div className="tab-content active" id="internal">
                <div className="service-details">
                    <div className="service-category">
                        <h3>対応疾患</h3>
                        <ul className="service-list">
                            <li>風邪・インフルエンザ</li>
                            <li>高血圧症</li>
                            <li>糖尿病</li>
                            <li>脂質異常症</li>
                            <li>痛風・高尿酸血症</li>
                            <li>甲状腺疾患</li>
                            <li>貧血</li>
                            <li>頭痛・めまい</li>
                            <li>腹痛・下痢・便秘</li>
                            <li>アレルギー疾患</li>
                        </ul>
                    </div>
                    <div className="service-category">
                        <h3>検査内容</h3>
                        <ul className="service-list">
                            <li>血液検査</li>
                            <li>尿検査</li>
                            <li>レントゲン検査</li>
                            <li>心電図検査</li>
                            <li>心エコー検査</li>
                            <li>ホルター心電図</li>
                        </ul>
                    </div>
                    <div className="service-category">
                        <h3>治療方針</h3>
                        <p>患者様の生活スタイルやご希望を伺いながら、エビデンスに基づいた最適な治療法をご提案します。薬物療法だけでなく、食事療法や運動療法など、総合的なアプローチで健康をサポートいたします。</p>
                    </div>
                </div>
            </div>

            <div className="tab-content" id="cardiology">
                <div className="service-details">
                    <div className="service-category">
                        <h3>対応疾患</h3>
                        <ul className="service-list">
                            <li>狭心症</li>
                            <li>心筋梗塞</li>
                            <li>不整脈</li>
                            <li>心不全</li>
                            <li>弁膜症</li>
                            <li>心筋症</li>
                            <li>高血圧症</li>
                            <li>動脈硬化</li>
                            <li>末梢動脈疾患</li>
                            <li>大動脈疾患</li>
                        </ul>
                    </div>
                    <div className="service-category">
                        <h3>専門検査</h3>
                        <ul className="service-list">
                            <li>心電図検査</li>
                            <li>心エコー検査</li>
                            <li>頸動脈エコー検査</li>
                            <li>ホルター心電図</li>
                            <li>血圧脈波検査(ABI)</li>
                            <li>運動負荷心電図</li>
                        </ul>
                    </div>
                    <div className="service-category">
                        <h3>専門医による診療</h3>
                        <p>循環器専門医が最新の知見に基づいた診断・治療を行います。心臓・血管に関する不安や症状がございましたら、お気軽にご相談ください。必要に応じて高度医療機関への紹介もスムーズに対応いたします。</p>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "var(--spacing-xl)" }}>
                <a href="tel:042-XXX-XXXX" className="btn btn-secondary">詳しくはお電話でご相談ください</a>
            </div>
        </div>
    </section>

    {/*  ========================================
         7. Features Section (当院の5つの特徴)
         ========================================  */}
    <section className="section" id="features" style={{ backgroundColor: "var(--color-secondary-beige)" }}>
        <div className="section-container">
            <h2 className="section-title">当院の5つの特徴</h2>
            <p className="section-subtitle">患者様に安心して通院いただけるよう、様々な取り組みを行っています。</p>
            
            <div className="features-grid">
                <div className="feature-card">
                    <img src="img/feature-icon-01-specialist.jpg" alt="" className="feature-icon" />
                    <h3>循環器専門医による<br />専門診療</h3>
                    <p>日本循環器学会認定の循環器専門医が在籍。心臓・血管疾患の診断から治療まで、専門的な医療を提供いたします。</p>
                </div>
                <div className="feature-card">
                    <img src="img/feature-icon-02-equipment.jpg" alt="" className="feature-icon" />
                    <h3>最新の医療設備を<br />完備</h3>
                    <p>心エコー、ホルター心電図など最新の検査機器を導入。精度の高い診断で、適切な治療へとつなげます。</p>
                </div>
                <div className="feature-card">
                    <img src="img/feature-icon-03-web-booking.jpg" alt="" className="feature-icon" />
                    <h3>WEB予約・<br />オンライン診療対応</h3>
                    <p>24時間いつでもWEB予約が可能。オンライン診療にも対応しており、ご自宅からでも診察を受けられます。</p>
                </div>
                <div className="feature-card">
                    <img src="img/feature-icon-04-collaboration.jpg" alt="" className="feature-icon" />
                    <h3>地域医療連携・<br />往診対応</h3>
                    <p>地域の医療機関と密に連携し、必要に応じて専門病院へのスムーズな紹介を行います。往診にも対応可能です。</p>
                </div>
                <div className="feature-card">
                    <img src="img/feature-icon-05-family-friendly.jpg" alt="" className="feature-icon" />
                    <h3>家族で通いやすい<br />環境</h3>
                    <p>バリアフリー設計、キッズスペース完備、駐車場あり。お子様からご高齢の方まで、ご家族皆様で安心して通院いただけます。</p>
                </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "var(--spacing-xl)" }}>
                <a href="/booking" className="btn btn-primary">今すぐ予約する</a>
            </div>
        </div>
    </section>

    {/*  ========================================
         8. Director & Staff Section (院長・スタッフ紹介)
         ========================================  */}
    <section className="section" id="director">
        <div className="section-container">
            <h2 className="section-title">院長・スタッフ紹介</h2>
            <p className="section-subtitle">経験豊富な医師とスタッフが、チーム一丸となって皆様の健康をサポートいたします。</p>
            
            <div className="director-intro">
                <div className="director-photo">
                    <img src="img/director-photo.jpg" alt="院長 今鷹太郎" />
                </div>
                <div className="director-info">
                    <h3>院長 今鷹 太郎</h3>
                    <p className="director-title">循環器専門医 / 内科医 / 産業医</p>
                    
                    <div className="director-credentials">
                        <h4>資格・所属</h4>
                        <ul>
                            <li>日本内科学会 総合内科専門医</li>
                            <li>日本循環器学会 循環器専門医</li>
                            <li>日本医師会認定 産業医</li>
                            <li>日本心血管インターベンション治療学会 認定医</li>
                        </ul>
                    </div>

                    <div className="director-credentials">
                        <h4>経歴</h4>
                        <ul>
                            <li>1995年 東京大学医学部卒業</li>
                            <li>1995年～2003年 東京大学医学部附属病院 循環器内科</li>
                            <li>2004年 今鷹医院 開業</li>
                        </ul>
                    </div>

                    <div className="director-message">
                        <p>地域の皆様の健康を守ることが私たちの使命です。循環器専門医としての経験を活かしながら、かかりつけ医として患者様一人ひとりに寄り添った医療を提供してまいります。どんな小さなことでもお気軽にご相談ください。</p>
                    </div>
                </div>
            </div>

            <h3 style={{ fontSize: "24px", textAlign: "center", margin: "var(--spacing-xxl) 0 var(--spacing-xl)", color: "var(--color-secondary-brown)" }}>スタッフ紹介</h3>
            
            <div className="staff-grid">
                <div className="staff-card">
                    <img src="img/staff-photo-01-nurse-a.jpg" alt="看護師A" className="staff-photo" />
                    <div className="staff-info">
                        <h4>田中 花子</h4>
                        <p className="staff-role">看護師</p>
                    </div>
                </div>
                <div className="staff-card">
                    <img src="img/staff-photo-02-nurse-b.jpg" alt="看護師B" className="staff-photo" />
                    <div className="staff-info">
                        <h4>佐藤 美咲</h4>
                        <p className="staff-role">看護師</p>
                    </div>
                </div>
                <div className="staff-card">
                    <img src="img/staff-photo-03-receptionist-c.jpg" alt="受付スタッフC" className="staff-photo" />
                    <div className="staff-info">
                        <h4>鈴木 優子</h4>
                        <p className="staff-role">受付スタッフ</p>
                    </div>
                </div>
                <div className="staff-card">
                    <img src="img/staff-photo-04-receptionist-d.jpg" alt="受付スタッフD" className="staff-photo" />
                    <div className="staff-info">
                        <h4>高橋 恵</h4>
                        <p className="staff-role">受付スタッフ</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  ========================================
         9. Flow Section (診療の流れ)
         ========================================  */}
    <section className="section" id="flow" style={{ backgroundColor: "var(--color-secondary-beige)" }}>
        <div className="section-container">
            <h2 className="section-title">診療の流れ</h2>
            <p className="section-subtitle">初めての方も安心してご来院いただけるよう、診療の流れをご案内いたします。</p>
            
            <div className="flow-timeline">
                <div className="flow-step">
                    <div className="flow-number">1</div>
                    <div className="flow-content">
                        <h3>予約</h3>
                        <p>WEB予約(24時間受付)またはお電話でご予約ください。当日予約も可能です。</p>
                    </div>
                </div>
                <div className="flow-step">
                    <div className="flow-number">2</div>
                    <div className="flow-content">
                        <h3>来院・受付</h3>
                        <p>予約時間の5分前までにご来院ください。初診の方は保険証、お薬手帳をご持参ください。</p>
                    </div>
                </div>
                <div className="flow-step">
                    <div className="flow-number">3</div>
                    <div className="flow-content">
                        <h3>問診</h3>
                        <p>問診票にご記入いただき、現在の症状や既往歴などを詳しくお伺いします。</p>
                    </div>
                </div>
                <div className="flow-step">
                    <div className="flow-number">4</div>
                    <div className="flow-content">
                        <h3>診察</h3>
                        <p>医師が丁寧に診察を行います。気になることは何でもお話しください。</p>
                    </div>
                </div>
                <div className="flow-step">
                    <div className="flow-number">5</div>
                    <div className="flow-content">
                        <h3>検査(必要時)</h3>
                        <p>必要に応じて血液検査、心電図、エコー検査などを実施いたします。</p>
                    </div>
                </div>
                <div className="flow-step">
                    <div className="flow-number">6</div>
                    <div className="flow-content">
                        <h3>診断・治療方針の説明</h3>
                        <p>検査結果をもとに診断を行い、治療方針を分かりやすくご説明します。</p>
                    </div>
                </div>
                <div className="flow-step">
                    <div className="flow-number">7</div>
                    <div className="flow-content">
                        <h3>会計・次回予約</h3>
                        <p>お会計後、必要に応じて次回の予約をお取りします。処方箋をお渡しいたします。</p>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "var(--spacing-xl)" }}>
                <a href="/booking" className="btn btn-primary">初診WEB予約はこちら</a>
                <a href="tel:042-XXX-XXXX" className="btn btn-outline" style={{ marginLeft: "var(--spacing-md)" }}>お電話でのご予約</a>
            </div>
        </div>
    </section>

    {/*  ========================================
         10. Facility Section (施設・設備紹介)
         ========================================  */}
    <section className="section" id="facility">
        <div className="section-container">
            <h2 className="section-title">施設・設備のご紹介</h2>
            <p className="section-subtitle">清潔で快適な環境と最新の医療機器を整えています。</p>
            
            <div className="facility-gallery">
                <div className="facility-item">
                    <img src="img/facility-waiting-room.jpg" alt="待合室" />
                    <div className="facility-label">待合室</div>
                </div>
                <div className="facility-item">
                    <img src="img/facility-examination-room.jpg" alt="診察室" />
                    <div className="facility-label">診察室</div>
                </div>
                <div className="facility-item">
                    <img src="img/facility-test-room.jpg" alt="検査室" />
                    <div className="facility-label">検査室</div>
                </div>
                <div className="facility-item">
                    <img src="img/facility-kids-space.jpg" alt="キッズスペース" />
                    <div className="facility-label">キッズスペース</div>
                </div>
            </div>

            <div className="equipment-list">
                <h3>主要医療機器一覧</h3>
                <ul className="equipment-grid">
                    <li>心電図検査装置</li>
                    <li>ホルター心電図</li>
                    <li>心エコー検査装置</li>
                    <li>頸動脈エコー装置</li>
                    <li>デジタルレントゲン</li>
                    <li>血液検査機器</li>
                    <li>血圧脈波検査装置(ABI)</li>
                    <li>スパイロメーター(肺機能検査)</li>
                </ul>
            </div>

            <div style={{ marginTop: "var(--spacing-xl)", padding: "var(--spacing-lg)", backgroundColor: "var(--color-white)", borderRadius: "12px" }}>
                <h3 style={{ fontSize: "20px", color: "var(--color-secondary-brown)", marginBottom: "var(--spacing-md)", textAlign: "center" }}>院内設備</h3>
                <ul className="service-list" style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <li>バリアフリー設計</li>
                    <li>車椅子対応トイレ</li>
                    <li>Wi-Fi完備</li>
                    <li>空気清浄機設置</li>
                    <li>駐車場完備(○台)</li>
                    <li>キッズスペース</li>
                </ul>
            </div>
        </div>
    </section>

    {/*  ========================================
         11. Reviews Section (患者様の声)
         ========================================  */}
    <section className="section" id="reviews" style={{ backgroundColor: "var(--color-secondary-beige)" }}>
        <div className="section-container">
            <h2 className="section-title">患者様の声</h2>
            <p className="section-subtitle">当院をご利用いただいた患者様から温かいお言葉をいただいております。</p>
            
            <div className="reviews-grid">
                <div className="review-card">
                    <div className="review-header">
                        <div className="review-avatar">60代<br />男性</div>
                        <div className="review-meta">
                            <h4>高血圧の治療で通院</h4>
                            <div className="review-stars">★★★★★ 5.0</div>
                        </div>
                    </div>
                    <p className="review-text">先生がとても親身になって話を聞いてくださいます。血圧のコントロールもうまくいき、今では安心して生活できています。スタッフの皆さんも優しく、通いやすいクリニックです。</p>
                </div>

                <div className="review-card">
                    <div className="review-header">
                        <div className="review-avatar">50代<br />女性</div>
                        <div className="review-meta">
                            <h4>定期健診で利用</h4>
                            <div className="review-stars">★★★★★ 5.0</div>
                        </div>
                    </div>
                    <p className="review-text">WEB予約ができて、待ち時間が少ないのが助かります。検査結果もその場で詳しく説明してくださり、安心できました。家族みんなでお世話になっています。</p>
                </div>

                <div className="review-card">
                    <div className="review-header">
                        <div className="review-avatar">70代<br />男性</div>
                        <div className="review-meta">
                            <h4>心臓の検査で受診</h4>
                            <div className="review-stars">★★★★★ 5.0</div>
                        </div>
                    </div>
                    <p className="review-text">循環器の専門医の先生に診ていただけるので安心です。動悸が気になっていましたが、丁寧に検査・説明していただき、不安が解消されました。</p>
                </div>

                <div className="review-card">
                    <div className="review-header">
                        <div className="review-avatar">40代<br />女性</div>
                        <div className="review-meta">
                            <h4>家族のかかりつけ医として</h4>
                            <div className="review-stars">★★★★★ 5.0</div>
                        </div>
                    </div>
                    <p className="review-text">子供の風邪から親の持病まで、家族全員でお世話になっています。駐車場があり、キッズスペースも充実しているので小さな子連れでも通いやすいです。</p>
                </div>

                <div className="review-card">
                    <div className="review-header">
                        <div className="review-avatar">30代<br />男性</div>
                        <div className="review-meta">
                            <h4>糖尿病の管理で通院</h4>
                            <div className="review-stars">★★★★★ 5.0</div>
                        </div>
                    </div>
                    <p className="review-text">生活習慣の改善も含めて親身にアドバイスしてくださいます。仕事が忙しくても、WEB予約で隙間時間に通えるのが便利です。</p>
                </div>

                <div className="review-card">
                    <div className="review-header">
                        <div className="review-avatar">60代<br />女性</div>
                        <div className="review-meta">
                            <h4>総合的な健康管理</h4>
                            <div className="review-stars">★★★★★ 5.0</div>
                        </div>
                    </div>
                    <p className="review-text">院内がとても清潔で、スタッフの皆さんの対応も素晴らしいです。先生は説明が丁寧で分かりやすく、質問にも優しく答えてくださいます。</p>
                </div>
            </div>

            <div className="review-cta">
                <p style={{ textAlign: "center", margin: "var(--spacing-xl) 0 var(--spacing-md)", fontSize: "18px", fontWeight: "600", color: "var(--color-secondary-brown)" }}>
                    Googleレビュー平均評価 ★★★★★ 4.8 / 5.0<br />
                    <small style={{ fontSize: "14px", fontWeight: "400", color: "var(--color-text-secondary)" }}>(患者満足度 96%)</small>
                </p>
                <div style={{ textAlign: "center" }}>
                    <a href="#" className="btn btn-outline">Googleレビューをもっと見る</a>
                </div>
            </div>
        </div>
    </section>

    {/*  ========================================
         12. FAQ Section (よくあるご質問)
         ========================================  */}
    <section className="section" id="faq">
        <div className="section-container">
            <h2 className="section-title">よくあるご質問</h2>
            <p className="section-subtitle">患者様からよくお問い合わせいただくご質問をまとめました。</p>
            
            <div className="faq-list">
                <div className="faq-item">
                    <button className="faq-question">初診時に必要な持ち物はありますか？</button>
                    <div className="faq-answer">
                        <div className="faq-answer-content">
                            健康保険証、お薬手帳(お持ちの方)、他院からの紹介状(ある場合)をご持参ください。また、現在服用中のお薬がある場合は、お薬の名前が分かるものをお持ちいただけると診療がスムーズです。
                        </div>
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">WEB予約は24時間可能ですか？</button>
                    <div className="faq-answer">
                        <div className="faq-answer-content">
                            はい、WEB予約は24時間365日いつでも受け付けております。当日予約も可能です。ただし、診療時間外のご予約については翌診療日以降のご案内となります。
                        </div>
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">駐車場はありますか？</button>
                    <div className="faq-answer">
                        <div className="faq-answer-content">
                            はい、医院専用の駐車場を○台分ご用意しております。満車の場合は近隣のコインパーキングをご利用ください。
                        </div>
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">クレジットカードや電子マネーは使えますか？</button>
                    <div className="faq-answer">
                        <div className="faq-answer-content">
                            はい、各種クレジットカード(VISA、MasterCard、JCB等)、交通系IC、PayPay、LINE Payなど各種キャッシュレス決済に対応しております。
                        </div>
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">オンライン診療は行っていますか？</button>
                    <div className="faq-answer">
                        <div className="faq-answer-content">
                            はい、再診の患者様に限りオンライン診療を行っております。事前にWEB予約システムからオンライン診療をご予約ください。初診の方は対面診療をお願いしております。
                        </div>
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">土曜日も診療していますか？</button>
                    <div className="faq-answer">
                        <div className="faq-answer-content">
                            はい、土曜日は午前中(9:00〜12:30)の診療を行っております。土曜午後、日曜、祝日は休診となります。
                        </div>
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">子供連れでも大丈夫ですか？</button>
                    <div className="faq-answer">
                        <div className="faq-answer-content">
                            はい、キッズスペースを完備しておりますので、お子様連れでも安心してご来院いただけます。絵本やおもちゃをご用意しております。
                        </div>
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">往診は対応していますか？</button>
                    <div className="faq-answer">
                        <div className="faq-answer-content">
                            はい、通院が困難な患者様には往診も対応しております。詳しくはお電話でご相談ください。
                        </div>
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">健康診断や予防接種は受けられますか？</button>
                    <div className="faq-answer">
                        <div className="faq-answer-content">
                            はい、各種健康診断(特定健診、企業健診など)、インフルエンザワクチン、肺炎球菌ワクチンなどの予防接種に対応しております。事前にご予約をお願いいたします。
                        </div>
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">検査結果はいつ分かりますか？</button>
                    <div className="faq-answer">
                        <div className="faq-answer-content">
                            院内で実施できる検査(心電図、エコー、一部の血液検査など)は当日中に結果をお伝えできます。外注検査の場合は3〜7日程度お時間をいただいております。
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "var(--spacing-xl)" }}>
                <p style={{ marginBottom: "var(--spacing-md)", color: "var(--color-text-primary)" }}>その他ご不明な点がございましたら、お気軽にお問い合わせください。</p>
                <a href="tel:042-XXX-XXXX" className="btn btn-secondary">お電話でお問い合わせ</a>
            </div>
        </div>
    </section>

    {/*  ========================================
         13. Access Section (診療時間・アクセス)
         ========================================  */}
    <section className="section" id="access" style={{ backgroundColor: "var(--color-secondary-beige)" }}>
        <div className="section-container">
            <h2 className="section-title">診療時間・アクセス</h2>
            <p className="section-subtitle">小平市鷹の台駅から徒歩5分。お車でもお越しいただけます。</p>
            
            <div className="access-content">
                <div className="access-info">
                    <h3>診療時間</h3>
                    <table className="hours-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>月</th>
                                <th>火</th>
                                <th>水</th>
                                <th>木</th>
                                <th>金</th>
                                <th>土</th>
                                <th>日</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>午前<br />9:00-12:30</strong></td>
                                <td>●</td>
                                <td>●</td>
                                <td>●</td>
                                <td>●</td>
                                <td>●</td>
                                <td>●</td>
                                <td className="closed">休</td>
                            </tr>
                            <tr>
                                <td><strong>午後<br />15:00-18:30</strong></td>
                                <td>●</td>
                                <td>●</td>
                                <td>●</td>
                                <td>●</td>
                                <td>●</td>
                                <td className="closed">休</td>
                                <td className="closed">休</td>
                            </tr>
                        </tbody>
                    </table>
                    <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginTop: "var(--spacing-sm)" }}>
                        ※休診日: 土曜午後・日曜・祝日<br />
                        ※急な休診の場合はホームページでお知らせいたします
                    </p>

                    <div style={{ marginTop: "var(--spacing-xl)" }}></div>
                    <h3>お問い合わせ</h3>
                    <div className="info-item">
                        <div className="info-label">住所</div>
                        <div className="info-value">〒187-XXXX<br />東京都小平市鷹の台○丁目○番○号</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">電話</div>
                        <div className="info-value"><a href="tel:042-XXX-XXXX" style={{ color: "var(--color-primary-orange)", fontWeight: "600" }}>042-XXX-XXXX</a></div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">FAX</div>
                        <div className="info-value">042-XXX-XXXX</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Email</div>
                        <div className="info-value">info@imataka-clinic.jp</div>
                    </div>

                    <div style={{ marginTop: "var(--spacing-lg)" }}></div>
                    <h3>交通アクセス</h3>
                    <div className="access-icons">
                        <div className="access-icon-item">
                            <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/></svg>
                            鷹の台駅 徒歩5分
                        </div>
                        <div className="access-icon-item">
                            <svg fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/></svg>
                            バス停 徒歩3分
                        </div>
                        <div className="access-icon-item">
                            <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8 2a.5.5 0 01.5.5V4h3V2.5a.5.5 0 011 0V4h1.5A1.5 1.5 0 0115.5 5.5v9a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 016 4h1.5V2.5A.5.5 0 018 2z"/></svg>
                            駐車場 ○台完備
                        </div>
                        <div className="access-icon-item">
                            <svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
                            自転車置き場あり
                        </div>
                    </div>
                </div>

                <div className="access-map">
                    <p style={{ color: "var(--color-text-secondary)" }}>Googleマップ<br />(実装時に埋め込みコードを挿入)</p>
                </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "var(--spacing-xl)" }}>
                <a href="#" className="btn btn-outline">Googleマップで開く</a>
                <a href="#" className="btn btn-outline" style={{ marginLeft: "var(--spacing-md)" }}>ルート検索</a>
            </div>
        </div>
    </section>

    {/*  ========================================
         14. Final CTA Section (最終CTA)
         ========================================  */}
    <section className="section final-cta" id="web-booking">
        <div className="section-container">
            <div className="cta-content">
                <h2 className="section-title">ご予約はこちら</h2>
                <p className="section-subtitle">24時間WEB予約受付中。お電話でもご予約いただけます。</p>
                
                <div className="cta-buttons">
                    <a href="/booking" className="btn">WEB予約<br /><small style={{ fontSize: "14px" }}>24時間受付</small></a>
                    <a href="tel:042-XXX-XXXX" className="btn">電話予約<br /><small style={{ fontSize: "14px" }}>042-XXX-XXXX</small></a>
                </div>

                <div className="booking-form" id="booking-form">
                    <h3>WEB予約フォーム</h3>
                    <form className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">お名前 <span style={{ color: "red" }}>*</span></label>
                            <input type="text" id="name" name="name" required placeholder="山田 太郎" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">電話番号 <span style={{ color: "red" }}>*</span></label>
                            <input type="tel" id="phone" name="phone" required placeholder="090-1234-5678" />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="email">メールアドレス <span style={{ color: "red" }}>*</span></label>
                            <input type="email" id="email" name="email" required placeholder="example@email.com" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">希望日 <span style={{ color: "red" }}>*</span></label>
                            <input type="date" id="date" name="date" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="time">希望時間 <span style={{ color: "red" }}>*</span></label>
                            <select id="time" name="time" required>
                                <option value="">選択してください</option>
                                <option value="09:00">9:00〜</option>
                                <option value="10:00">10:00〜</option>
                                <option value="11:00">11:00〜</option>
                                <option value="15:00">15:00〜</option>
                                <option value="16:00">16:00〜</option>
                                <option value="17:00">17:00〜</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="visit-type">受診区分 <span style={{ color: "red" }}>*</span></label>
                            <select id="visit-type" name="visit-type" required>
                                <option value="">選択してください</option>
                                <option value="first">初診</option>
                                <option value="return">再診</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="symptoms">症状・ご相談内容</label>
                            <textarea id="symptoms" name="symptoms" placeholder="気になる症状やご相談内容をお書きください"></textarea>
                        </div>
                        <div className="form-submit">
                            <button type="submit" className="btn">予約を送信する</button>
                        </div>
                    </form>
                </div>

                <p style={{ marginTop: "var(--spacing-xl)", fontSize: "18px", fontWeight: "600" }}>今鷹医院はあなたの健康パートナーです</p>
                <p style={{ marginTop: "var(--spacing-sm)", fontSize: "15px" }}>お気軽にご相談ください。スタッフ一同、心よりお待ちしております。</p>
            </div>
        </div>
    </section>

    {/*  ========================================
         15. Footer (フッター)
         ========================================  */}
    <footer className="footer" role="contentinfo">
        <div className="footer-container">
            <div className="footer-section">
                <h3>今鷹医院</h3>
                <p>地域に寄り添い、家族のように温かく<br />一人ひとりの健康を守ります</p>
                <div className="social-links">
                    <a href="#" aria-label="Instagram">
                        <img src="img/social-icon-instagram.png" alt="" className="social-icon" />
                    </a>
                    <a href="#" aria-label="Facebook">
                        <img src="img/social-icon-facebook.png" alt="" className="social-icon" />
                    </a>
                    <a href="#" aria-label="LINE">
                        <img src="img/social-icon-line.png" alt="" className="social-icon" />
                    </a>
                </div>
            </div>

            <div className="footer-section">
                <h3>診療時間</h3>
                <p>月〜金: 9:00-12:30 / 15:00-18:30<br />
                土: 9:00-12:30<br />
                休診: 土曜午後・日曜・祝日</p>
            </div>

            <div className="footer-section">
                <h3>お問い合わせ</h3>
                <p>〒187-XXXX<br />
                東京都小平市鷹の台○丁目○番○号<br />
                TEL: <a href="tel:042-XXX-XXXX">042-XXX-XXXX</a><br />
                FAX: 042-XXX-XXXX<br />
                Email: info@imataka-clinic.jp</p>
            </div>

            <div className="footer-section">
                <h3>サイトマップ</h3>
                <nav className="footer-nav">
                    <a href="#services">診療案内</a>
                    <a href="#features">当院の特徴</a>
                    <a href="#director">院長紹介</a>
                    <a href="#facility">施設・設備</a>
                    <a href="#reviews">患者様の声</a>
                    <a href="#faq">FAQ</a>
                    <a href="#access">アクセス</a>
                    <a href="/booking">WEB予約</a>
                </nav>
            </div>
        </div>

        <div className="footer-bottom">
            <p>&copy; 2026 今鷹医院. All rights reserved.</p>
        </div>
    </footer>

    {/*  ========================================
         JavaScript
         ========================================  */}
    

    </>
  );
}
