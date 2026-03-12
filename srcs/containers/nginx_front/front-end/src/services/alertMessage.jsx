import Swal from "sweetalert2"


export const AlertMessage = Swal.mixin({
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
  theme: "borderless",
  topLayer: true,
  timerProgressBar: true,
  position: "top-end",
  buttonsStyling: false,
  showConfirmButton: true,
  showCancelButton: true,
  customClass: {
    popup:`
      bg-shell text-black
      rounded-2xl shadow-xl
      p-4 m-5 sm:m-10
      w-[50%] sm:w-[40%] md:w-[30%] lg:w-[25%] xl:w-[15%]
      text-xs sm:text-sm lg:text-base
      font-Corben`,
    confirmButton: `
      bg-greenish text-shell
      px-4 py-2 rounded-lg
      mr-2
      hover:bg-greyish`,
    cancelButton: `
      bg-darkRed text-shell
      px-4 py-2 rounded-lg
      hover:bg-greyish`
  },
})


export const Alert2FA = Swal.mixin({
  theme: "borderless",
  topLayer: true,
  position: "top-end",
  buttonsStyling: false,
  showConfirmButton: false,
  input: "text",
  inputPlaceholder: "Your 2FA Code",
  showCancelButton: false,
  confirmButtonText: "Verify",
  allowEscapeKey: true,
  // allowOutsideClick: false,
  customClass: {
    popup:`
      bg-shell text-black
      rounded-2xl shadow-xl
      p-4 m-5 sm:m-10
      w-[50%] sm:w-[40%] md:w-[30%] lg:w-[25%] xl:w-[15%]
      text-xs sm:text-sm lg:text-base
      font-Corben`,
  },
})
