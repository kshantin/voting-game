import React from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import './voting.css'

const Voting = (props) => {
  return (
    <div className="voting-container">
      <Helmet>
        <title>Voting - Outstanding Old Bison</title>
        <meta property="og:title" content="Voting - Outstanding Old Bison" />
      </Helmet>
      <Header rootClassName="header-root-class-name"></Header>
      <h1 className="voting-text">Голосование</h1>
      <div data-thq="thq-dropdown" className="voting-thq-dropdown list-item">
        <div data-thq="thq-dropdown-toggle" className="voting-dropdown-toggle">
          <svg viewBox="0 0 1024 1024" className="voting-icon">
            <path d="M426 726v-428l214 214z"></path>
          </svg>
          <span>Лидер общественного мнения</span>
          <div
            data-thq="thq-dropdown-arrow"
            className="voting-dropdown-arrow"
          ></div>
        </div>
        <ul data-thq="thq-dropdown-list" className="voting-dropdown-list">
          <li data-thq="thq-dropdown" className="voting-dropdown list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle01"
            >
              <span className="voting-text02">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown01 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle02"
            >
              <span className="voting-text03">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown02 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle03"
            >
              <span className="voting-text04">Sub-menu Item</span>
            </div>
          </li>
        </ul>
      </div>
      <div data-thq="thq-dropdown" className="voting-thq-dropdown1 list-item">
        <div
          data-thq="thq-dropdown-toggle"
          className="voting-dropdown-toggle04"
        >
          <svg viewBox="0 0 1024 1024" className="voting-icon02">
            <path d="M426 726v-428l214 214z"></path>
          </svg>
          <span>Автор ключевых идей</span>
          <div
            data-thq="thq-dropdown-arrow"
            className="voting-dropdown-arrow1"
          ></div>
        </div>
        <ul data-thq="thq-dropdown-list" className="voting-dropdown-list1">
          <li data-thq="thq-dropdown" className="voting-dropdown03 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle05"
            >
              <span className="voting-text06">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown04 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle06"
            >
              <span className="voting-text07">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown05 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle07"
            >
              <span className="voting-text08">Sub-menu Item</span>
            </div>
          </li>
        </ul>
      </div>
      <div data-thq="thq-dropdown" className="voting-thq-dropdown2 list-item">
        <div
          data-thq="thq-dropdown-toggle"
          className="voting-dropdown-toggle08"
        >
          <svg viewBox="0 0 1024 1024" className="voting-icon04">
            <path d="M426 726v-428l214 214z"></path>
          </svg>
          <span>Достоин стать президентом</span>
          <div
            data-thq="thq-dropdown-arrow"
            className="voting-dropdown-arrow2"
          ></div>
        </div>
        <ul data-thq="thq-dropdown-list" className="voting-dropdown-list2">
          <li data-thq="thq-dropdown" className="voting-dropdown06 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle09"
            >
              <span className="voting-text10">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown07 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle10"
            >
              <span className="voting-text11">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown08 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle11"
            >
              <span className="voting-text12">Sub-menu Item</span>
            </div>
          </li>
        </ul>
      </div>
      <div data-thq="thq-dropdown" className="voting-thq-dropdown3 list-item">
        <div
          data-thq="thq-dropdown-toggle"
          className="voting-dropdown-toggle12"
        >
          <svg viewBox="0 0 1024 1024" className="voting-icon06">
            <path d="M426 726v-428l214 214z"></path>
          </svg>
          <span>Топ 3 коммуникативных  нав.</span>
          <div
            data-thq="thq-dropdown-arrow"
            className="voting-dropdown-arrow3"
          ></div>
        </div>
        <ul data-thq="thq-dropdown-list" className="voting-dropdown-list3">
          <li data-thq="thq-dropdown" className="voting-dropdown09 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle13"
            >
              <span className="voting-text14">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown10 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle14"
            >
              <span className="voting-text15">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown11 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle15"
            >
              <span className="voting-text16">Sub-menu Item</span>
            </div>
          </li>
        </ul>
      </div>
      <div data-thq="thq-dropdown" className="voting-thq-dropdown4 list-item">
        <div
          data-thq="thq-dropdown-toggle"
          className="voting-dropdown-toggle16"
        >
          <svg viewBox="0 0 1024 1024" className="voting-icon08">
            <path d="M426 726v-428l214 214z"></path>
          </svg>
          <span>Топ 3 положительных героев</span>
          <div
            data-thq="thq-dropdown-arrow"
            className="voting-dropdown-arrow4"
          ></div>
        </div>
        <ul data-thq="thq-dropdown-list" className="voting-dropdown-list4">
          <li data-thq="thq-dropdown" className="voting-dropdown12 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle17"
            >
              <span className="voting-text18">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown13 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle18"
            >
              <span className="voting-text19">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown14 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle19"
            >
              <span className="voting-text20">Sub-menu Item</span>
            </div>
          </li>
        </ul>
      </div>
      <div data-thq="thq-dropdown" className="voting-thq-dropdown5 list-item">
        <div
          data-thq="thq-dropdown-toggle"
          className="voting-dropdown-toggle20"
        >
          <svg viewBox="0 0 1024 1024" className="voting-icon10">
            <path d="M426 726v-428l214 214z"></path>
          </svg>
          <span>Топ 3 положительных героев</span>
          <div
            data-thq="thq-dropdown-arrow"
            className="voting-dropdown-arrow5"
          ></div>
        </div>
        <ul data-thq="thq-dropdown-list" className="voting-dropdown-list5">
          <li data-thq="thq-dropdown" className="voting-dropdown15 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle21"
            >
              <span className="voting-text22">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown16 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle22"
            >
              <span className="voting-text23">Sub-menu Item</span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="voting-dropdown17 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="voting-dropdown-toggle23"
            >
              <span className="voting-text24">Sub-menu Item</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Voting
