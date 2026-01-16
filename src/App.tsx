import './App.css'

import banner from './assets/banner.webp'
import avatar from './assets/avatar.svg'

const inviteRows = Array.from({ length: 5 }, (_, i) => ({ id: i }))

export default function App() {
    const onAdd = (index: number) => {
        alert(`Add clicked: row ${index + 1}`)
    }

    return (
        <div className="screen">

            <main className="content">
                {/* Top banner card */}
                <section className="bannerCard">
                    <img className="bannerImage" src={banner} alt="Banner" draggable={false} />
                    <div className="bannerText">
                        <div className="bannerSubtitle">Найзаа уриад</div>
                        <div className="bannerTitle">Датагаа 3 үржүүлээд ав</div>
                        <div className="bannerDesc">
                            Toki Mobile-д найзуудaa уриад хүссэн датагаа авах бүрдээ датагаа 3 үржүүлээрэй.
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom “stuck to walls” card */}
            <section className="bottomSheet">
                <div className="bottomTitle">Миний урьсан</div>

                <div className="innerWhiteCard">
                    {inviteRows.map((row) => (
                        <div key={row.id} className="inviteRow">
                            <div className="left">
                                <img className="avatar" src={avatar} alt="" draggable={false} />
                                <div className="inviteText">Найзаа урих</div>
                            </div>

                            <button
                                className="addBtn"
                                type="button"
                                aria-label="Add"
                                onClick={() => onAdd(row.id)}
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}