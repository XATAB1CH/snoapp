import { Link, useLocation } from "react-router-dom";

// импорт иконок (поменяй имена под свои файлы)
import icNews    from "../../assets/tab-news.svg";
import icGame    from "../../assets/tab-game.svg";
import icRating  from "../../assets/tab-rating.svg";
import icShop    from "../../assets/tab-shop.svg";
import icProfile from "../../assets/tab-profile.svg";

const items = [
  { to: "/",        icon: icProfile,    label: "Профиль" },
  { to: "/game",    icon: icGame,    label: "Игра" },
  { to: "/rating",  icon: icRating,  label: "Рейтинг" },
  { to: "/shop",    icon: icShop,    label: "Магазин" },
  { to: "/news",    icon: icNews, label: "Новости" }, // если нужна другая — подмени
];

export default function TabBar() {
  const { pathname } = useLocation();
  return (
    <div className="tabbar">
      <nav>
        {items.map(i => {
          const active = pathname === i.to;
          return (
            <Link
              key={i.to}
              to={i.to}
              className={`tab-item ${active ? "tab-active" : ""}`}
              aria-label={i.label}
            >
              <img className="tab-icon" src={i.icon} alt="" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
