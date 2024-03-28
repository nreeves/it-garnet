Swal.bindClickHandler();
/* Bind a mixin to a click handler */
Swal.mixin({
  toast: true
}).bindClickHandler("data-swal-toast-template");