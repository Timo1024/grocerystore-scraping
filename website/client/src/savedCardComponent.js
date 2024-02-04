import React from 'react';

const SavedCardComponent = ({ foodInfo, newPrice, oldPrice, discountFactor, pricePerUnit, image, category, store, dates, rowid, onDelete }) => {
// const CardComponent = (x) => {

    const getPrice = (price) => {
        let newPrice = price;
        // if price contains a * remove the * and return the price
        if(newPrice.includes('*')) {
            newPrice = newPrice.replace('*', '');
        }
        // if newPrice doesnt contain € add € to the end but first trim the string
        if(!newPrice.includes('€')) {
            newPrice = newPrice.trim() + " €";
        }
        return newPrice;
    }
    
    const getStoreImage = (store) => {
        if (store === 'Kaufland') {
            return <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
            <g>
            <path d="M0.73584 1.73584C0.73584 1.18355 1.18356 0.73584 1.73584 0.73584H24.2641C24.8164 0.73584 25.2641 1.18356 25.2641 1.73584V24.2641C25.2641 24.8164 24.8164 25.2641 24.2641 25.2641H1.73584C1.18355 25.2641 0.73584 24.8164 0.73584 24.2641V1.73584Z" fill="white"/>
            <path d="M1.70737 24.2927H24.2926V1.70728H1.70737V24.2927ZM23.3213 23.3214H2.67868V2.67879H23.3213V23.3214Z" fill="#E10915"/>
            <path d="M8.74997 5.83569V9.96414H12.8784V5.83569H8.74997ZM13.6072 5.83569V9.96414L17.7356 5.83569H13.6072ZM8.74997 10.6927V14.8212H12.8784V10.6927H8.74997ZM13.6072 10.6927V14.8212H17.7356L13.6072 10.6927Z" fill="#E10915"/>
            <path d="M12.821 17.1792C12.7981 17.1792 12.7752 17.1801 12.7523 17.182C12.5384 17.1666 12.3287 17.2462 12.1788 17.3997C12.0291 17.5532 11.9545 17.7649 11.9751 17.9784V18.2214H11.6862V18.6923H11.9751V20.1642H12.558V18.6754H13.221V18.2067H12.558V18.0269C12.558 17.7842 12.6722 17.6578 12.8761 17.6578L12.8787 17.6555C12.9868 17.6527 13.0933 17.6823 13.1845 17.7405L13.2768 17.3034C13.1384 17.2216 12.9809 17.1789 12.821 17.1792ZM4.62152 17.223V20.1642H5.28218V18.8405L6.24622 20.1642H7.01116L5.87713 18.6608L6.99424 17.223H6.24622L5.28218 18.571V17.223H4.62152ZM13.5513 17.223V20.164H14.1342V17.223H13.5513ZM20.8127 17.223V18.4374C20.6507 18.2674 20.4259 18.1715 20.1909 18.1728C19.6397 18.1728 19.2656 18.6268 19.2656 19.2025C19.2462 19.4614 19.3345 19.7168 19.5096 19.9087C19.6847 20.1002 19.9313 20.2112 20.1909 20.2151C20.4261 20.2181 20.6517 20.1221 20.8127 19.9504V20.1642H21.3785V17.223H20.8127ZM18.2361 18.1602C18.2232 18.16 18.2102 18.1601 18.1972 18.1606V18.1629C17.9597 18.1614 17.733 18.2623 17.5755 18.4399V18.1969H17.0071V20.1642H17.5778V18.8795C17.6718 18.7396 17.8294 18.6558 17.9978 18.656C18.1059 18.6499 18.2109 18.6923 18.2841 18.7718C18.3575 18.8513 18.3916 18.9593 18.3768 19.0664V20.1642H18.9499V18.9499C18.9674 18.7421 18.895 18.5367 18.7512 18.3858C18.6161 18.2443 18.4304 18.1634 18.2361 18.1602ZM7.854 18.1678C7.30748 18.1678 6.93112 18.6219 6.93112 19.1975C6.91163 19.4561 6.9995 19.7113 7.17422 19.9029C7.34874 20.0943 7.59472 20.2057 7.854 20.2102C8.07828 20.2131 8.29452 20.1256 8.45367 19.9674V20.1642H9.0221V18.2067H8.45367V18.4108C8.29296 18.255 8.07788 18.1678 7.854 18.1678ZM15.4213 18.1678C14.8748 18.1678 14.4984 18.6219 14.4984 19.1975C14.4789 19.4561 14.5669 19.7113 14.7416 19.9029C14.9163 20.0943 15.162 20.2057 15.4213 20.2102C15.6458 20.2131 15.8618 20.1256 16.0212 19.9674V20.1642H16.5894V18.2067H16.0212V18.4108C15.8603 18.255 15.6452 18.1678 15.4213 18.1678ZM9.42519 18.2067V19.4211C9.40771 19.6289 9.48005 19.8342 9.6239 19.9851C9.7679 20.136 9.9696 20.2179 10.1782 20.2102C10.4188 20.2087 10.6471 20.1034 10.8045 19.9212V20.1642H11.3729V18.2067H10.8045V19.4913C10.7077 19.6283 10.552 19.7111 10.3845 19.7148C10.2767 19.7199 10.1721 19.6772 10.0987 19.5981C10.0251 19.519 9.99023 19.4116 10.0032 19.3044V18.2067H9.42519ZM8.03855 18.6438C8.19715 18.6426 8.34846 18.7098 8.45367 18.8285V19.5352C8.34861 19.654 8.19715 19.7213 8.03855 19.7198C7.75544 19.7007 7.53552 19.4656 7.53552 19.1819C7.53552 18.8982 7.75544 18.6628 8.03855 18.6438ZM15.6058 18.6438C15.7644 18.6426 15.916 18.7098 16.0212 18.8285V19.5352C15.9161 19.654 15.7644 19.7213 15.6058 19.7198C15.3227 19.7007 15.1028 19.4656 15.1028 19.1819C15.1028 18.8982 15.3227 18.6628 15.6058 18.6438ZM20.3755 18.6463C20.5458 18.6439 20.7074 18.7212 20.8127 18.8551V19.5134C20.7074 19.6471 20.5458 19.7244 20.3755 19.7221C20.0923 19.703 19.8724 19.468 19.8724 19.1842C19.8724 18.9005 20.0923 18.6654 20.3755 18.6463Z" fill="#E10915"/>
            </g>
            <defs>
            <clipPath id="clip0_46_704">
            <rect width="26" height="26" fill="white"/>
            </clipPath>
            </defs>
            </svg>;
        } else if (store === 'Penny') {
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g>
            <path d="M24 0H0V24H24V0Z" fill="#CD1414"/>
            <path d="M22.5005 13.2336C22.5005 13.4049 22.4497 13.5724 22.3546 13.7148C22.2594 13.8572 22.1241 13.9682 21.9658 14.0338C21.8076 14.0994 21.6334 14.1165 21.4654 14.0831C21.2974 14.0497 21.143 13.9672 21.0219 13.846C20.9008 13.7249 20.8183 13.5706 20.7849 13.4026C20.7514 13.2345 20.7686 13.0604 20.8342 12.9021C20.8997 12.7439 21.0107 12.6086 21.1532 12.5134C21.2956 12.4182 21.4631 12.3674 21.6344 12.3674C21.8641 12.3674 22.0844 12.4587 22.2468 12.6211C22.4093 12.7836 22.5005 13.0039 22.5005 13.2336Z" fill="#FFD200"/>
            <path d="M3.30204 11.9239H3.62378C3.98955 11.9239 4.21138 11.6978 4.25117 11.4159C4.28504 11.1729 4.1157 10.9079 3.7711 10.9079H3.46206L3.30204 11.9239ZM19.5812 11.3372L20.3144 9.96215H22.0001L19.4601 13.989H17.7371L18.5524 12.84L17.6211 10.046L16.9861 13.9873H15.6382L14.8101 12.1246L14.5104 13.9873H13.1616L13.8102 9.96046H15.1945L15.9972 11.7622L16.2876 9.96046H19.2357L19.5812 11.3372ZM13.2776 9.96215L12.6291 13.989H11.2761L10.448 12.1263L10.1483 13.989H8.79954L9.44809 9.96215H10.8324L11.6342 11.7639L11.9246 9.96215H13.2776ZM4.15888 9.90119C5.09023 9.90119 5.7227 10.4092 5.72863 11.2186L5.92675 9.9613H8.98073L8.81647 10.9773H7.20778L7.12734 11.4599H8.58617L8.42361 12.4666H6.95801L6.87334 12.967H8.5159L8.35164 13.983H5.27904L5.63041 11.8028C5.39419 12.509 4.74986 12.9247 3.90657 12.9247H3.1327L2.96337 13.983H1.50031L2.15902 9.89526L4.15888 9.90119Z" fill="white"/>
            </g>
            <defs>
            <clipPath id="clip0_46_661">
            <rect width="24" height="24" rx="1" fill="white"/>
            </clipPath>
            </defs>
            </svg>;
        } else if (store === 'Aldi') {
            return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none">
            <g>
              <path d="M20 23.1992C20 23.636 19.6359 24 19.199 24H0.800971C0.364078 24 0 23.636 0 23.1992V0.800809C0 0.364004 0.364078 0 0.800971 0H19.199C19.6359 0 20 0.364004 20 0.800809V23.1992Z" fill="#FFC800"/>
              <path d="M19.0291 22.5196C19.0291 22.8108 18.7864 23.0535 18.4952 23.0535H1.50487C1.2136 23.0535 0.970886 22.8108 0.970886 22.5196V1.48016C0.970886 1.18896 1.2136 0.946289 1.50487 0.946289H18.5194C18.8107 0.946289 19.0534 1.18896 19.0534 1.48016L19.0291 22.5196Z" fill="#FF7800"/>
              <path d="M18.3252 21.9617C18.3252 22.1801 18.1553 22.3499 17.9369 22.3499H2.06309C1.84465 22.3499 1.67474 22.1801 1.67474 21.9617V2.01425C1.67474 1.79585 1.84465 1.62598 2.06309 1.62598H17.9369C18.1553 1.62598 18.3252 1.79585 18.3252 2.01425V21.9617Z" fill="#D70000"/>
              <path d="M17.767 21.5006C17.767 21.6704 17.6214 21.7918 17.4757 21.7918H2.54856C2.37865 21.7918 2.25729 21.6462 2.25729 21.5006V2.47529C2.25729 2.30542 2.40292 2.18408 2.54856 2.18408H17.4757C17.6456 2.18408 17.767 2.32968 17.767 2.47529V21.5006Z" fill="#00005F"/>
              <path d="M9.92719 20.3356C9.36893 20.3356 9.27185 20.093 9.27185 19.5105V18.5884H9.73301V19.6319C9.73301 19.8988 9.75728 20.0201 9.95146 20.0201C10.1214 20.0201 10.1699 19.9231 10.1699 19.6319V18.5884H10.6068V19.5105C10.6068 20.1415 10.4369 20.3356 9.92719 20.3356ZM10.2427 18.4185C10.1214 18.4185 10.0243 18.3215 10.0243 18.2001C10.0243 18.0788 10.1214 17.9575 10.2427 17.9575C10.3641 17.9575 10.4612 18.0788 10.4612 18.2001C10.4612 18.3215 10.3641 18.4185 10.2427 18.4185ZM9.61165 18.4185C9.49029 18.4185 9.39321 18.3215 9.39321 18.2001C9.39321 18.0788 9.49029 17.9575 9.61165 17.9575C9.73301 17.9575 9.8301 18.0788 9.8301 18.2001C9.8301 18.3215 9.73301 18.4185 9.61165 18.4185ZM10.9223 20.2871V18.5884H11.4078C12.0146 18.5884 12.2816 18.7097 12.2816 19.4377C12.2816 20.1658 12.0146 20.2871 11.4078 20.2871H10.9223ZM11.4806 19.9959C11.7233 19.9959 11.8204 19.8503 11.8204 19.4377C11.8204 19.0495 11.7233 18.8796 11.4806 18.8796H11.3835V19.9959H11.4806ZM8.32524 20.3356C8.05825 20.3356 7.86408 20.2871 7.76699 20.2628L7.83981 19.9473C8.00971 19.9959 8.13107 20.0201 8.22816 20.0201C8.34952 20.0201 8.49515 19.9959 8.49515 19.8503C8.49515 19.7532 8.37379 19.6804 8.25243 19.6076H8.22816C8.03398 19.4863 7.81554 19.3649 7.81554 19.098C7.81554 18.7825 8.03398 18.6127 8.4466 18.6127C8.66505 18.6127 8.78641 18.6369 8.95631 18.6855L8.8835 18.9767C8.83495 18.9524 8.68932 18.9039 8.51942 18.9039C8.37379 18.9039 8.2767 18.9524 8.2767 19.0737C8.2767 19.1708 8.39806 19.2436 8.54369 19.3164H8.56796C8.76214 19.4377 9.00486 19.5591 9.00486 19.826C9.00486 20.1415 8.78641 20.3356 8.32524 20.3356ZM6.35923 17.5692C6.31068 17.3751 6.23787 17.0353 6.18932 16.8897H4.85437C4.80583 17.0353 4.73301 17.3751 4.68447 17.5692H3.49515C4.00486 15.9676 4.2233 15.3124 4.80583 13.8806H6.26214C6.82039 15.2881 7.06311 15.9676 7.57282 17.5692H6.35923ZM5.02427 16.1132H6.01942C5.87379 15.6278 5.6068 14.8028 5.53398 14.5601C5.4369 14.7785 5.16991 15.6036 5.02427 16.1132ZM8.85923 17.5692C8.22816 17.5692 7.88835 17.2052 7.88835 16.5742V13.8806H9.00486V16.3558C9.00486 16.6713 9.10194 16.7441 9.41748 16.7441H10.5097L10.6796 17.5692H8.85923ZM15.1942 13.8806H16.3107V17.5692H15.1942V13.8806ZM11.1165 17.5692V13.8806H12.6456C13.7864 13.8806 14.5631 14.3417 14.5631 15.7006C14.5631 17.011 13.932 17.5692 12.6942 17.5692H11.1165ZM12.233 16.7684H12.5485C13.2282 16.7684 13.4951 16.4529 13.4951 15.7006C13.4951 14.9726 13.1553 14.6814 12.5 14.6814H12.233V16.7684Z" fill="white"/>
              <path d="M9.5631 3.49438C8.88348 3.49438 8.59222 3.97972 8.32523 4.732L5.99513 11.6723C5.80096 12.279 5.53397 12.6188 5.09708 12.6673V12.7158H6.31067C6.99028 12.7158 7.28154 12.2305 7.54853 11.4782L9.9029 4.56213C10.0971 3.95546 10.3883 3.61572 10.8252 3.56719V3.51865C10.6068 3.49438 9.61164 3.49438 9.5631 3.49438Z" fill="url(#paint0_linear_46_687)"/>
              <path d="M11.7718 3.49438C11.0922 3.49438 10.801 3.97972 10.534 4.732L8.17961 11.6481C7.98544 12.2547 7.71845 12.5945 7.28156 12.643V12.6916H8.49515C9.17476 12.6916 9.46602 12.2062 9.73301 11.4539L12.0874 4.53786C12.2816 3.93119 12.5728 3.59145 13.0097 3.54292V3.49438H11.7718Z" fill="url(#paint1_linear_46_687)"/>
              <path d="M7.35437 3.5188C6.67476 3.5188 6.3835 4.00414 6.11651 4.75641L3.42233 12.7402H4.10194C4.78156 12.7402 5.07282 12.2549 5.33981 11.5026L7.69418 4.56228C7.88835 3.9556 8.17961 3.61587 8.61651 3.56733V3.5188H7.35437Z" fill="url(#paint2_linear_46_687)"/>
              <path d="M14.3932 6.72206C14.1262 6.18818 13.8592 6.13965 13.3738 6.13965H12.1359L11.6505 7.5714H14.0534C14.3932 7.5714 14.6845 7.61993 14.8786 7.88687H14.9272C14.9272 7.8626 14.4417 6.86766 14.3932 6.72206Z" fill="url(#paint3_linear_46_687)"/>
              <path d="M15.267 8.78456C15.0243 8.27495 14.733 8.20215 14.2476 8.20215H11.4563L10.9709 9.6339H14.9272C15.2913 9.6339 15.5583 9.68243 15.7524 9.94937H15.801C15.801 9.94937 15.3155 8.90589 15.267 8.78456Z" fill="url(#paint4_linear_46_687)"/>
              <path d="M16.165 10.9201C15.9223 10.362 15.6068 10.2649 15.1213 10.2649H10.7524L10.3398 11.454C10.3155 11.551 10.2912 11.6238 10.2427 11.6966H15.7767C16.0922 11.6966 16.3592 11.7452 16.5777 12.0121H16.6262C16.6262 12.0364 16.1893 10.9929 16.165 10.9201Z" fill="url(#paint5_linear_46_687)"/>
            </g>
            <defs>
              <linearGradient id="paint0_linear_46_687" x1="8.03397" y1="12.8129" x2="8.03397" y2="3.60626" gradientUnits="userSpaceOnUse">
                <stop stop-color="#1482AF"/>
                <stop offset="0.02" stop-color="#3798BF"/>
                <stop offset="0.054" stop-color="#6EB9D8"/>
                <stop offset="0.083" stop-color="#95D1EA"/>
                <stop offset="0.106" stop-color="#AEE0F5"/>
                <stop offset="0.12" stop-color="#B7E5F9"/>
                <stop offset="0.2" stop-color="#97DAF6"/>
                <stop offset="0.334" stop-color="#67CAF2"/>
                <stop offset="0.4" stop-color="#55C3F0"/>
                <stop offset="0.6" stop-color="#55C3F0"/>
                <stop offset="0.666" stop-color="#67CAF2"/>
                <stop offset="0.8" stop-color="#97DAF6"/>
                <stop offset="0.88" stop-color="#B7E5F9"/>
                <stop offset="0.894" stop-color="#AEE0F5"/>
                <stop offset="0.917" stop-color="#95D1EA"/>
                <stop offset="0.947" stop-color="#6EB9D8"/>
                <stop offset="0.98" stop-color="#3798BF"/>
                <stop offset="1" stop-color="#1482AF"/>
              </linearGradient>
              <linearGradient id="paint1_linear_46_687" x1="10.2184" y1="12.7886" x2="10.2184" y2="3.59145" gradientUnits="userSpaceOnUse">
                <stop stop-color="#1482AF"/>
                <stop offset="0.02" stop-color="#3798BF"/>
                <stop offset="0.054" stop-color="#6EB9D8"/>
                <stop offset="0.083" stop-color="#95D1EA"/>
                <stop offset="0.106" stop-color="#AEE0F5"/>
                <stop offset="0.12" stop-color="#B7E5F9"/>
                <stop offset="0.2" stop-color="#97DAF6"/>
                <stop offset="0.334" stop-color="#67CAF2"/>
                <stop offset="0.4" stop-color="#55C3F0"/>
                <stop offset="0.6" stop-color="#55C3F0"/>
                <stop offset="0.666" stop-color="#67CAF2"/>
                <stop offset="0.8" stop-color="#97DAF6"/>
                <stop offset="0.88" stop-color="#B7E5F9"/>
                <stop offset="0.894" stop-color="#AEE0F5"/>
                <stop offset="0.917" stop-color="#95D1EA"/>
                <stop offset="0.947" stop-color="#6EB9D8"/>
                <stop offset="0.98" stop-color="#3798BF"/>
                <stop offset="1" stop-color="#1482AF"/>
              </linearGradient>
              <linearGradient id="paint2_linear_46_687" x1="6.09224" y1="12.8373" x2="6.09224" y2="3.61587" gradientUnits="userSpaceOnUse">
                <stop stop-color="#1482AF"/>
                <stop offset="0.02" stop-color="#3798BF"/>
                <stop offset="0.054" stop-color="#6EB9D8"/>
                <stop offset="0.083" stop-color="#95D1EA"/>
                <stop offset="0.106" stop-color="#AEE0F5"/>
                <stop offset="0.12" stop-color="#B7E5F9"/>
                <stop offset="0.2" stop-color="#97DAF6"/>
                <stop offset="0.334" stop-color="#67CAF2"/>
                <stop offset="0.4" stop-color="#55C3F0"/>
                <stop offset="0.6" stop-color="#55C3F0"/>
                <stop offset="0.666" stop-color="#67CAF2"/>
                <stop offset="0.8" stop-color="#97DAF6"/>
                <stop offset="0.88" stop-color="#B7E5F9"/>
                <stop offset="0.894" stop-color="#AEE0F5"/>
                <stop offset="0.917" stop-color="#95D1EA"/>
                <stop offset="0.947" stop-color="#6EB9D8"/>
                <stop offset="0.98" stop-color="#3798BF"/>
                <stop offset="1" stop-color="#1482AF"/>
              </linearGradient>
              <linearGradient id="paint3_linear_46_687" x1="11.8148" y1="7.85144" x2="14.5006" y2="6.73866" gradientUnits="userSpaceOnUse">
                <stop offset="0.2" stop-color="#55C3F0"/>
                <stop offset="0.316" stop-color="#67CAF2"/>
                <stop offset="0.549" stop-color="#97DAF6"/>
                <stop offset="0.69" stop-color="#B7E5F9"/>
                <stop offset="0.727" stop-color="#AEE0F5"/>
                <stop offset="0.786" stop-color="#95D1EA"/>
                <stop offset="0.862" stop-color="#6EB9D8"/>
                <stop offset="0.949" stop-color="#3798BF"/>
                <stop offset="1" stop-color="#1482AF"/>
              </linearGradient>
              <linearGradient id="paint4_linear_46_687" x1="11.2354" y1="10.194" x2="15.2423" y2="8.53403" gradientUnits="userSpaceOnUse">
                <stop offset="0.3" stop-color="#55C3F0"/>
                <stop offset="0.409" stop-color="#67CAF2"/>
                <stop offset="0.628" stop-color="#97DAF6"/>
                <stop offset="0.76" stop-color="#B7E5F9"/>
                <stop offset="0.788" stop-color="#AEE0F5"/>
                <stop offset="0.835" stop-color="#95D1EA"/>
                <stop offset="0.893" stop-color="#6EB9D8"/>
                <stop offset="0.961" stop-color="#3798BF"/>
                <stop offset="1" stop-color="#1482AF"/>
              </linearGradient>
              <linearGradient id="paint5_linear_46_687" x1="10.6315" y1="12.5322" x2="15.9502" y2="10.3287" gradientUnits="userSpaceOnUse">
                <stop stop-color="#73CDF3"/>
                <stop offset="0.115" stop-color="#62C8F1"/>
                <stop offset="0.242" stop-color="#58C4F0"/>
                <stop offset="0.4" stop-color="#55C3F0"/>
                <stop offset="0.497" stop-color="#67CAF2"/>
                <stop offset="0.692" stop-color="#97DAF6"/>
                <stop offset="0.81" stop-color="#B7E5F9"/>
                <stop offset="0.832" stop-color="#AEE0F5"/>
                <stop offset="0.869" stop-color="#95D1EA"/>
                <stop offset="0.915" stop-color="#6EB9D8"/>
                <stop offset="0.969" stop-color="#3798BF"/>
                <stop offset="1" stop-color="#1482AF"/>
              </linearGradient>
              <clipPath id="clip0_46_687">
                <rect width="20" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>;
        } else {
            return null; // Return null or a default image if the store name doesn't match any of the conditions
        }
    };

    function formatSentence(sentence, width) {
        const words = sentence.split(' ');
        let formattedSentence = '';
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const tempLine = line + ' ' + word;

            if (tempLine.length <= width) {
                line = tempLine.trim();
            } else {
                if (line.length > 0) {
                    formattedSentence += line + '<br/>';
                    line = '';
                }
                let hyphenatedWord = '';
                for (let j = 0; j < word.length; j++) {
                    hyphenatedWord += word[j];
                    if (hyphenatedWord.length === width) {
                        if(hyphenatedWord[-1] == "/" || hyphenatedWord[-1] == "-" || hyphenatedWord[-1] == ";" || word[j+1] == "/" || word[j+1] == "-" || word[j+1] == ";"){
                            formattedSentence += hyphenatedWord + '<br/>';
                        } else {
                            formattedSentence += hyphenatedWord + '-<br/>';
                        }
                        hyphenatedWord = '';
                    }
                }
                line = hyphenatedWord.trim();
            }
        }

        if (line.length > 0) {
            formattedSentence += line;
        }

        return <div dangerouslySetInnerHTML={{ __html: formattedSentence }} />;
    }

    return (
        // <div className='savedCardText'>{foodInfo}</div>

        <div className="cardSaved">

            <div className="cardSavedOverlay">
                <div className="cardSavedOverlayText">{
                    formatSentence(foodInfo, 13)
                    // foodInfo
                }</div>
                <div className="cardSavedOverlayRemove" onClick={onDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M0.313814 0.313814C0.732233 -0.104605 1.41062 -0.104605 1.82904 0.313814L7.5 5.98477L13.171 0.313814C13.5894 -0.104605 14.2678 -0.104605 14.6862 0.313814C15.1046 0.732233 15.1046 1.41062 14.6862 1.82904L9.01523 7.5L14.6862 13.171C15.1046 13.5894 15.1046 14.2678 14.6862 14.6862C14.2678 15.1046 13.5894 15.1046 13.171 14.6862L7.5 9.01523L1.82904 14.6862C1.41062 15.1046 0.732233 15.1046 0.313814 14.6862C-0.104605 14.2678 -0.104605 13.5894 0.313814 13.171L5.98477 7.5L0.313814 1.82904C-0.104605 1.41062 -0.104605 0.732233 0.313814 0.313814Z" fill="white"/>
                    </svg>
                </div>
            </div>

            <div className="cardSavedHeader">
                {/* <div className="cardSavedStore">{getStoreImage(store)}</div> */}
                <div className="cardSavedStore">{getStoreImage(store)}</div>
                <div className="cardSavedPriceWrapper">
                    <div className="cardSavedPrice">{getPrice(newPrice)}</div>
                    <div className="saved-price-per-unit">{pricePerUnit}</div>
                </div>
            </div>
            <div className="cardSavedFoodImageWrapper">
                <img className="cardSavedFoodImage" src={image} alt={foodInfo} />
            </div>
        </div>
    );
};



export default SavedCardComponent;
