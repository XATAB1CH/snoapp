import logo from "../../assets/logo.svg"; // твой логотип в assets

export default function Header() {
  return (
    <div className="header">
      <div className="header-inner">
        <div className="header-card">
          <img src={logo} alt="SNO" style={{width:40, height:40}} />
          <div>
            <div className="brand-title">Студенческое<br/>Научное Общество</div>
            {/* можно скрыть подзаголовок, если не нужен */}
            {/* <div className="brand-sub">Губкинский университет</div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
