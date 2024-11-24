import { ChevronIcon, DiagramIcon, GalleryIcon, HomeWifiIcon, InstagramIcon, MenuIcon, SearchIcon, ShoppingCardIcon, TelegramIcon, TwitterIcon, UserIcon } from "@/assets/Icons";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";

export default function Home() {
  return (
    <MainLayout>

      {/*//! START Header Slider */}
      <section className="w-full md:h-[400px] h-[350px] bg-[url('/images/background-hero-1.png')] bg-center bg-cover">

        <div className="relative w-full h-full flex flex-col items-end justify-center">

          <div className="w-full flex items-center justify-between px-6">
            <button className="p-3 md:block hidden">
              <ChevronIcon className="-rotate-90 stroke-white w-7 h-7" />
            </button>
            <h1 className="text-white xl:text-4.5xl lg:text-4xl text-3xl md:leading-normal leading-[45px] font-bold text-center">
              تجربه غذای سالم و گیاهی به سبک ترخینه
            </h1>
            <button className="p-3 md:block hidden">
              <ChevronIcon className="rotate-90 stroke-white w-7 h-7" />
            </button>
          </div>

          <div className="justify-items-end self-center md:mt-8 mt-5">
            <button className="bg-[#417F56] rounded-lg py-2 px-8 text-white lg:text-base text-super-sm">
              سفارش آنلاین غذا
            </button>
          </div>

          <div
            className="bg-white flex items-center gap-2.5 md:py-3 py-2.5 md:px-9 px-7 rounded-t-2xl absolute bottom-0 left-[50%] translate-x-[-50%]"
          >

            <div className="md:w-3 md:h-3 w-2 h-2 bg-[#417F56] rounded-full"></div>
            <div className="md:w-2 md:h-2 w-1.5 h-1.5 bg-[#ADADAD] rounded-full"></div>
            <div className="md:w-2 md:h-2 w-1.5 h-1.5 bg-[#ADADAD] rounded-full"></div>
            <div className="md:w-2 md:h-2 w-1.5 h-1.5 bg-[#ADADAD] rounded-full"></div>
            <div className="md:w-2 md:h-2 w-1.5 h-1.5 bg-[#ADADAD] rounded-full"></div>

          </div>

        </div>

      </section>
      {/*//? Header Slider */}


      {/*//! START Menu Type */}
      <section className="lg:pt-16 pt-12 lg:pb-24 md:pb-20 pb-24 container">
        <h4 className="md:text-3xl text-2.5xl font-semibold text-center">
          منو رستوران
        </h4>

        {/*//! Food Menu List */}
        <div className="grid md:grid-cols-4 grid-cols-2 md:gap-5 gap-x-5 gap-y-36 3xl:mt-64 2xl:mt-44 xl:mt-28 md:mt-20 mt-28">


          {/*//! Single Item */}
          <div className="relative w-full xl:h-[170px] lg:h-[140px] h-[110px] bg-[#417F56] rounded-lg">

            <img
              src="/images/food-image.png"
              alt=""
              className="absolute bottom-[30px] right-[50%] translate-x-[50%] w-[85%]"
            />

            {/*//TODO Title Label */}
            <div
              className="absolute lg:bottom-[-25px] -bottom-5 right-[50%] translate-x-[50%] w-[65%] lg:h-[50px] h-10 bg-[#F9F9F9] flex items-center justify-center rounded-md shadow-lg"
            >
              <p className="lg:text-lg text-super-sm text-[#353535] font-medium">غذای اصلی</p>
            </div>

          </div>

          {/*//! Single Item */}
          <div className="relative w-full xl:h-[170px] lg:h-[140px] h-[110px] bg-[#417F56] rounded-lg">

            <img
              src="/images/appetizer-image.png"
              alt=""
              className="absolute bottom-[30px] right-[50%] translate-x-[50%] w-[85%]"
            />

            {/*//TODO Title Label */}
            <div
              className="absolute lg:bottom-[-25px] -bottom-5 right-[50%] translate-x-[50%] w-[65%] lg:h-[50px] h-10 bg-[#F9F9F9] flex items-center justify-center rounded-md shadow-lg"
            >
              <p className="lg:text-lg text-super-sm text-[#353535] font-medium">پیش غذا</p>
            </div>

          </div>

          {/*//! Single Item */}
          <div className="relative w-full xl:h-[170px] lg:h-[140px] h-[110px] bg-[#417F56] rounded-lg">

            <img
              src="/images/dessert-image.png"
              alt=""
              className="absolute bottom-[30px] right-[50%] translate-x-[50%] w-[85%]"
            />

            {/*//TODO Title Label */}
            <div
              className="absolute lg:bottom-[-25px] -bottom-5 right-[50%] translate-x-[50%] w-[65%] lg:h-[50px] h-10 bg-[#F9F9F9] flex items-center justify-center rounded-md shadow-lg"
            >
              <p className="lg:text-lg text-super-sm text-[#353535] font-medium">دسر</p>
            </div>

          </div>

          {/*//! Single Item */}
          <div className="relative w-full xl:h-[170px] lg:h-[140px] h-[110px] bg-[#417F56] rounded-lg">

            <img
              src="/images/drink-image.png"
              alt=""
              className="absolute bottom-[30px] right-[50%] translate-x-[50%] md:w-[80%] w-[80%]"
            />

            {/*//TODO Title Label */}
            <div
              className="absolute lg:bottom-[-25px] -bottom-5 right-[50%] translate-x-[50%] w-[65%] lg:h-[50px] h-10 bg-[#F9F9F9] flex items-center justify-center rounded-md shadow-lg"
            >
              <p className="lg:text-lg text-super-sm text-[#353535] font-medium">نوشیدنی</p>
            </div>

          </div>




        </div>

      </section>
      {/*//? END Menu Type */}

      {/*//! START About Section */}
      <section className="w-full bg-[url('/images/about-background-hero.jpg')] bg-cover bg-center md:py-20 py-12">
        <div className="container grid md:grid-cols-2 xl:gap-10 lg:gap-20 md:gap-10 gap-16">

          {/*//TODO Right Side */}
          <div>

            <h2 className="lg:text-2.5xl text-1.5xl text-white font-semibold mb-5">
              رستوران های زنجیره ای ترخینه
            </h2>
            <p className="text-white lg:text-base text-sm text-justify md:leading-8 leading-7 tracking-wide font-light">
              مهمان‌نوازی یکی از مهم‌ترین مشخصه‌های ایرانیان است و باعث افتخار
              ماست که بیش از 20 سال است خدمت‌گزار مردم شریف ایران هستیم. ما در رستوران‌های زنجیره‌ای ترخینه همواره تلاش کردیم که
              در محیطی اصیل بر پایه معماری و طراحی مدرن در کنار طبیعتی دلنواز، غذایی سالم و درخور شان شما عزیزان ارائه دهیم.
            </p>

            <button
              className="flex items-center justify-between gap-2 border border-white rounded-md py-2 px-5 md:mt-7 mt-4 float-left"
            >
              <ShoppingCardIcon className="stroke-white w-[22px] h-[22px]" />
              <span className="text-white text-super-sm">اطلاعات بیشتر</span>
              <ChevronIcon className="stroke-white rotate-90" />
            </button>

          </div>

          {/*//TODO Left Side */}
          <div className="flex flex-col justify-center lg:gap-20 gap-10">

            <div className="flex items-center justify-center lg:gap-20 gap-10">

              <div className="flex flex-col items-justify items-center">
                <UserIcon className="xl:w-10 xl:h-10 w-9 h-9 stroke-white" />
                <span className="text-white xl:text-base lg:text-super-sm text-sm text-center mt-3">
                  پرسنلی مجرب و حرفه ای
                </span>
              </div>
              <div className="flex flex-col items-justify items-center">
                <DiagramIcon className="xl:w-10 xl:h-10 w-9 h-9 stroke-white" />
                <span className="text-white xl:text-base lg:text-super-sm text-sm text-center mt-3">
                  پرسنلی مجرب و حرفه ای
                </span>
              </div>

            </div>

            <div className="flex items-center justify-center lg:gap-20 gap-10">

              <div className="flex flex-col items-justify items-center">
                <HomeWifiIcon className="xl:w-10 xl:h-10 w-9 h-9 stroke-white" />
                <span className="text-white xl:text-base lg:text-super-sm text-sm text-center mt-3">
                  پرسنلی مجرب و حرفه ای
                </span>
              </div>
              <div className="flex flex-col items-justify items-center">
                <MenuIcon className="xl:w-10 xl:h-10 w-9 h-9 stroke-white" />
                <span className="text-white xl:text-base lg:text-super-sm text-sm text-center mt-3">
                  پرسنلی مجرب و حرفه ای
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>
      {/*//? END About Section */}


      {/*//! START Branch Section */}
      <section className="container lg:py-20 pt-12 pb-20">

        <h4 className="md:text-3xl text-2.5xl font-semibold text-center">
          ترخینه گردی
        </h4>

        {/*//! Branch List */}
        <div className="grid xl:grid-cols-4 md:grid-cols-2 xl:gap-7 md:gap-10 gap-5 mt-11">


          {/*//Todo Single Card  */}
          <div
            className="bg-white md:h-[410px] h-[140px] md:block flex group border border-[#CBCBCB] hover:border-[#417F56] rounded-lg transition-all duration-300 overflow-hidden"
          >

            <div
              className="relative md:w-full w-[45%] md:h-[280px] group-hover:md:h-[230px] transition-all duration-500"
            >
              <img
                src="/images/restaurant-image-1.jpg"
                alt=""
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute top-0 right-0 w-full h-full md:bg-black/50 flex md:items-center md:justify-center justify-start items-end p-2 md:opacity-0 group-hover:opacity-100 duration-600"
              >
                <button className="md:w-16 md:h-16 w-11 h-11 md:bg-white/20 hover:md:bg-white/30 bg-black/30 hover:bg-black/40 rounded-full flex items-center justify-center duration-300">
                  <div className="md:w-12 md:h-12 w-9 h-9 md:bg-white/30 bg-black/40 rounded-full flex items-center justify-center">
                    <GalleryIcon className="md:w-8 md:h-8 w-7 h-7" />
                  </div>
                </button>
              </div>
            </div>

            <div className="relative md:block flex flex-col justify-center px-4 md:pb-8 pb-5 pt-5 flex-1 text-center">
              <h3 className="md:text-xl font-medium text-[#353535] md:mb-3.5 mb-2">
                شعبه تهرانپارس
              </h3>
              <p className="text-[#717171] md:text-base text-sm md:mb-4">
                تهران پارس، فلکه سوم، پاساژ سیوان
              </p>

              <button
                className="md:flex items-center flex-nowrap hidden absolute -bottom-20 group-hover:bottom-0 right-[50%] translate-x-[50%] border border-[#315F41] rounded-md text-[#315F41] text-super-sm py-1 px-4 leading-6 transition-all duration-600"
              >
                صفحه شعبه <ChevronIcon className="rotate-90 inline stroke-[#315F41]" />
              </button>

            </div>

          </div>

          {/*//Todo Single Card  */}
          <div
            className="bg-white md:h-[410px] h-[140px] md:block flex group border border-[#CBCBCB] hover:border-[#417F56] rounded-lg transition-all duration-300 overflow-hidden"
          >

            <div
              className="relative md:w-full w-[45%] md:h-[280px] group-hover:md:h-[230px] transition-all duration-500"
            >
              <img
                src="/images/restaurant-image-2.jpg"
                alt=""
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute top-0 right-0 w-full h-full md:bg-black/50 flex md:items-center md:justify-center justify-start items-end p-2 md:opacity-0 group-hover:opacity-100 duration-600"
              >
                <button className="md:w-16 md:h-16 w-11 h-11 md:bg-white/20 hover:md:bg-white/30 bg-black/30 hover:bg-black/40 rounded-full flex items-center justify-center duration-300">
                  <div className="md:w-12 md:h-12 w-9 h-9 md:bg-white/30 bg-black/40 rounded-full flex items-center justify-center">
                    <GalleryIcon className="md:w-8 md:h-8 w-7 h-7" />
                  </div>
                </button>
              </div>
            </div>

            <div className="relative md:block flex flex-col justify-center px-4 md:pb-8 pb-5 pt-5 flex-1 text-center">
              <h3 className="md:text-xl font-medium text-[#353535] md:mb-3.5 mb-2">
                شعبه چالوس
              </h3>
              <p className="text-[#717171] md:text-base text-sm md:mb-4">
                چالوس، خیابان ۱۷ شهریور، بعد کوچه کوروش، جنب داروخانه دکتر میلانی
              </p>

              <button
                className="md:flex items-center flex-nowrap hidden absolute -bottom-20 group-hover:bottom-0 right-[50%] translate-x-[50%] border border-[#315F41] rounded-md text-[#315F41] text-super-sm py-1 px-4 leading-6 transition-all duration-600"
              >
                صفحه شعبه <ChevronIcon className="rotate-90 inline stroke-[#315F41]" />
              </button>

            </div>

          </div>

          {/*//Todo Single Card  */}
          <div
            className="bg-white md:h-[410px] h-[140px] md:block flex group border border-[#CBCBCB] hover:border-[#417F56] rounded-lg transition-all duration-300 overflow-hidden"
          >

            <div
              className="relative md:w-full w-[45%] md:h-[280px] group-hover:md:h-[230px] transition-all duration-500"
            >
              <img
                src="/images/restaurant-image-3.jpg"
                alt=""
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute top-0 right-0 w-full h-full md:bg-black/50 flex md:items-center md:justify-center justify-start items-end p-2 md:opacity-0 group-hover:opacity-100 duration-600"
              >
                <button className="md:w-16 md:h-16 w-11 h-11 md:bg-white/20 hover:md:bg-white/30 bg-black/30 hover:bg-black/40 rounded-full flex items-center justify-center duration-300">
                  <div className="md:w-12 md:h-12 w-9 h-9 md:bg-white/30 bg-black/40 rounded-full flex items-center justify-center">
                    <GalleryIcon className="md:w-8 md:h-8 w-7 h-7" />
                  </div>
                </button>
              </div>
            </div>

            <div className="relative md:block flex flex-col justify-center px-4 md:pb-8 pb-5 pt-5 flex-1 text-center">
              <h3 className="md:text-xl font-medium text-[#353535] md:mb-3.5 mb-2">
                شعبه اقدسیه
              </h3>
              <p className="text-[#717171] md:text-base text-sm md:mb-4">
                خیابان اقدسیه ، نرسیده به میدان خیام، پلاک ۸
              </p>

              <button
                className="md:flex items-center flex-nowrap hidden absolute -bottom-20 group-hover:bottom-0 right-[50%] translate-x-[50%] border border-[#315F41] rounded-md text-[#315F41] text-super-sm py-1 px-4 leading-6 transition-all duration-600"
              >
                صفحه شعبه <ChevronIcon className="rotate-90 inline stroke-[#315F41]" />
              </button>

            </div>

          </div>

          {/*//Todo Single Card  */}
          <div
            className="bg-white md:h-[410px] h-[140px] md:block flex group border border-[#CBCBCB] hover:border-[#417F56] rounded-lg transition-all duration-300 overflow-hidden"
          >

            <div
              className="relative md:w-full w-[45%] md:h-[280px] group-hover:md:h-[230px] transition-all duration-500"
            >
              <img
                src="/images/restaurant-image-4.jpg"
                alt=""
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute top-0 right-0 w-full h-full md:bg-black/50 flex md:items-center md:justify-center justify-start items-end p-2 md:opacity-0 group-hover:opacity-100 duration-600"
              >
                <button className="md:w-16 md:h-16 w-11 h-11 md:bg-white/20 hover:md:bg-white/30 bg-black/30 hover:bg-black/40 rounded-full flex items-center justify-center duration-300">
                  <div className="md:w-12 md:h-12 w-9 h-9 md:bg-white/30 bg-black/40 rounded-full flex items-center justify-center">
                    <GalleryIcon className="md:w-8 md:h-8 w-7 h-7" />
                  </div>
                </button>
              </div>
            </div>

            <div className="relative md:block flex flex-col justify-center px-4 md:pb-8 pb-5 pt-5 flex-1 text-center">
              <h3 className="md:text-xl font-medium text-[#353535] md:mb-3.5 mb-2">
                شعبه ونک
              </h3>
              <p className="text-[#717171] md:text-base text-sm md:mb-4">
                میدان ونک، خیابان فردوسی، نبش کوچه نیلوفر، پلاک ۲۶
              </p>

              <button
                className="md:flex items-center flex-nowrap hidden absolute -bottom-20 group-hover:bottom-0 right-[50%] translate-x-[50%] border border-[#315F41] rounded-md text-[#315F41] text-super-sm py-1 px-4 leading-6 transition-all duration-600"
              >
                صفحه شعبه <ChevronIcon className="rotate-90 inline stroke-[#315F41]" />
              </button>

            </div>

          </div>



        </div>

      </section>
      {/*//? END Branch Section */}



      {/*//! START Footer */}
      <footer className="w-full py-20 bg-[url('/images/footer-background-hero.jpg')] bg-cover bg-center">
        <div className="container grid grid-cols-2">

          {/*//TODO Right Side */}
          <div className="flex items-center justify-around gap-4">

            {/*//TODO Links */}
            <div>
              <h6 className="text-white text-lg font-semibold mb-6">
                دسترسی آسان
              </h6>
              <ul className="space-y-4 text-[#EDEDED] text-super-sm font-light">
                <li><Link href="">پرسش های متداول</Link></li>
                <li><Link href="">قوانین ترخینه</Link></li>
                <li><Link href="">حریم خصوصی</Link></li>
                <div className="flex items-center gap-5">
                  <a href=""><TwitterIcon /></a>
                  <a href=""><InstagramIcon /></a>
                  <a href=""><TelegramIcon /></a>
                </div>
              </ul>
            </div>

            {/*//TODO Links */}
            <div>
              <h6 className="text-white text-lg font-semibold mb-6">
                شعبه های ترخینه
              </h6>
              <ul className="space-y-4 text-[#EDEDED] text-super-sm font-light">
                <li><Link href="">شهبه تهرانپارس</Link></li>
                <li><Link href="">شعبه چالوس</Link></li>
                <li><Link href="">شعبه اقدسیه</Link></li>
                <li><Link href="">شعبه ونک</Link></li>
              </ul>
            </div>

          </div>

          {/*//TODO Left Side */}
          <div className="">
            <h6 className="text-white text-2.5xl font-semibold mb-7">
              پیام به ترخینه
            </h6>

            <form action="" className="">
              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="نام و نام خانوادگی"
                    className="bg-transparent w-full backdrop-blur-sm border border-[#717171] rounded-lg py-2.5 px-5 text-sm placeholder:text-[#F9F9F9] text-[#F9F9F9]"
                  />
                  <input
                    type="text"
                    placeholder="شماره تماس"
                    className="bg-transparent w-full backdrop-blur-sm border border-[#717171] rounded-lg py-2.5 px-5 text-sm placeholder:text-[#F9F9F9] text-[#F9F9F9]"
                  />
                  <input
                    type="text"
                    placeholder="آدرس ایمیل (اختیاری)"
                    className="bg-transparent w-full backdrop-blur-sm border border-[#717171] rounded-lg py-2.5 px-5 text-sm placeholder:text-[#F9F9F9] text-[#F9F9F9]"
                  />
                </div>

                <textarea
                  name=""
                  id=""
                  placeholder="پیام شما"
                  className="bg-transparent w-full backdrop-blur-sm border border-[#717171] rounded-lg py-2.5 px-5 text-sm placeholder:text-[#F9F9F9] text-[#F9F9F9]"
                />

              </div>

              <p className="text-sm text-[#CBCBCB] mt-2 text-left">۰/۲۰۰</p>
              <button className="text-[#F9F9F9] text-super-sm border border-[#717171] rounded-lg float-left mt-2 py-2.5 px-16">
                ارسال پیام
              </button>
            </form>

          </div>


        </div>
      </footer>
      {/*//? END Footer */}

    </MainLayout>
  );
}
