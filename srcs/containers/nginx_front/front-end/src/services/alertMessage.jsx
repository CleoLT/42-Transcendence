import Swal from "sweetalert2"

export const AlertMessage = Swal.mixin({
  // title: "Alert theme",
  theme: "borderless",
  topLayer: true,
  timerProgressBar: true,
  timer:2500,
  position: "top-end",
  buttonsStyling: false,
  showConfirmButton: false,
  customClass: {
    popup:`
      bg-shell text-black
      rounded-2xl shadow-xl
      p-4 m-5 sm:m-10
      w-[50%] sm:w-[40%] md:w-[30%] lg:w-[25%] xl:w-[15%]
      text-xs sm:text-sm lg:text-base
      font-Corben`,
    // icon: "scale-50"
  },
})

export const OptionAlert = Swal.mixin({
  // title: "Alert theme",
  theme: "borderless",
  topLayer: true,
  timerProgressBar: true,
  //timer:2500,
  position: "top-end",
  buttonsStyling: true,
  showConfirmButton: true,
  customClass: {
    popup:`
      bg-shell text-black
      rounded-2xl shadow-xl
      p-4 m-5 sm:m-10
      w-[50%] sm:w-[40%] md:w-[30%] lg:w-[25%] xl:w-[15%]
      text-xs sm:text-sm lg:text-base
      font-Corben`,
    // icon: "scale-50"
  },
})