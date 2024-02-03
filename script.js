// Slider Background
let background = ["bg1.jpg", "bg2.jpg", "bg3.jpg"];
let indexBackground = 0;
let sliderBackground = document.getElementById("sliderBackground");

setInterval(function changeImage() {
  indexBackground = (indexBackground + 1) % background.length;
  sliderBackground.style.backgroundImage =
    "url(images/" + background[indexBackground] + ")";
}, 5000);

// Buku Elemen Template
function bukuElemenTemplate(buku, kalimatTombol, booleanTombol) {
  return `
      <div class="border-custom border-info bg-second mb-3">
        <div class="d-flex justify-content-between">
          <h3 class="judul">${buku.judul}</h3>
          <button class="btn btn-primary" onclick="editModal(${buku.id})" data-bs-toggle="modal" data-bs-target="#editBukuModal">Edit Buku</button>
        </div>
        <p class="penulis">Penulis: ${buku.penulis}</p>
        <p class="tahun">Tahun: ${buku.tahun}</p>
        <div class="d-flex justify-content-between flex-md-column flex-lg-row">
          <button class="btn btn-success" onclick="pindahBuku(${buku.id}, ${booleanTombol})">
            ${kalimatTombol}
          </button>
          <button class="btn btn-danger mt-md-3 mt-lg-0" onclick="hapusBuku(${buku.id})">Hapus Buku</button>
        </div>
      </div>
  `;
}

// Menampilkan data pada Rak Buku
function tampilkanBuku() {
  // ambil data buku dari local storage
  let dataBuku = JSON.parse(localStorage.getItem("buku"));

  // Pastikan ada data buku yang tersimpan
  if (dataBuku) {
    // ambil template untuk tempat menyimpan seluruh bukunya
    let templateSudahDibaca = document.getElementById("templateSudahDibaca");
    let templateBelumDibaca = document.getElementById("templateBelumDibaca");

    // buat variabel daftar buku untuk menampung sementara buku-bukunya
    let listBukuSudahDibaca = "";
    let listBukuBelumDibaca = "";

    // Loop melalui setiap buku dalam array dataBuku
    dataBuku.forEach(function (buku) {
      // Apakah bukunya sudah dibaca
      if (buku.isComplete) {
        // buat elemen untuk bukunya (judul, penulis, tahun)
        let bukuElemen = bukuElemenTemplate(buku, "Belum Selesai Dibaca", false);
        // tambahkan elemen buku ke dalam variabel daftar buku
        listBukuSudahDibaca = listBukuSudahDibaca + bukuElemen;
      } else {
        // buat elemen untuk bukunya (judul, penulis, tahun)
        let bukuElemen = bukuElemenTemplate(buku, "Selesai Dibaca", true);
        // tambahkan elemen buku ke dalam variabel daftar buku
        listBukuBelumDibaca = listBukuBelumDibaca + bukuElemen;
      }
    });
    // Mengganti/Memperbarui daftar buku-bukunya ke dalam elemen template
    templateSudahDibaca.innerHTML = listBukuSudahDibaca;
    templateBelumDibaca.innerHTML = listBukuBelumDibaca;
  }
}

// Tampilkan data pada Rak Buku pada saat halaman reload pertama kali
tampilkanBuku();

// Menambahkan Data Buku
function tambahBuku(event) {
  event.preventDefault(); // Mencegah perilaku bawaan formulir (submit) untuk direfresh
  const elemenForm = event.target; // mendapatkan elemen form

  // nilai-nilai input
  let inputJudul = elemenForm.querySelector("#judul").value;
  let inputPenulis = elemenForm.querySelector("#penulis").value;
  let inputTahun = elemenForm.querySelector("#tahun").value;
  inputTahun = Number(inputTahun); // mengubah tahun menjadi integer
  let inputDibaca = elemenForm.querySelector("#dibaca").checked;

  // Mendapatkan data buku dari localStorage (jika ada)
  let dataBuku = JSON.parse(localStorage.getItem("buku"));

  // Jika tidak ada data buku, inisialisasi sebagai array kosong
  if (!dataBuku) {
    dataBuku = [];
  }

  // objek JavaScript dengan nilai input dan ID unik
  const buku = {
    id: Date.now(),
    judul: inputJudul,
    penulis: inputPenulis,
    tahun: inputTahun,
    isComplete: inputDibaca,
  };

  // Menambahkan buku baru ke dalam array dataBuku
  dataBuku.push(buku);

  // Konversi objek JavaScript menjadi JSON
  const bukuJSON = JSON.stringify(dataBuku);

  // Simpan objek JSON ke dalam localStorage
  localStorage.setItem("buku", bukuJSON);

  // Perbarui tampilan data pada Rak Buku
  tampilkanBuku();

  // Reset nilai-nilai input
  elemenForm.querySelector("#judul").value = "";
  elemenForm.querySelector("#penulis").value = "";
  elemenForm.querySelector("#tahun").value = "";
  elemenForm.querySelector("#dibaca").checked = false;

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Buku berhasil ditambahkan",
    showConfirmButton: false,
    timer: 1500,
  });
}

// Hapus Data Buku
function hapusBuku(idBuku) {
  Swal.fire({
    title: "Konfirmasi Hapus",
    text: "Apakah Anda yakin  menghapus buku ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33ingin",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // ambil data buku dari local storage
      let dataBuku = JSON.parse(localStorage.getItem("buku"));

      // Temukan indeks buku yang akan dihapus dalam array dataBuku
      let indexBukuHapus = dataBuku.findIndex((buku) => buku.id === idBuku);

      // Periksa apakah buku ditemukan
      if (indexBukuHapus !== -1) {
        // Hapus buku dari array dataBuku
        dataBuku.splice(indexBukuHapus, 1);

        // Simpan kembali array dataBuku yang telah diperbarui ke localStorage
        localStorage.setItem("buku", JSON.stringify(dataBuku));

        // Perbarui tampilan data pada Rak Buku
        tampilkanBuku();
        // console.log("Buku telah dihapus dari localStorage");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Buku berhasil dihapus",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.log("Buku tidak ditemukan dalam localStorage");
      }
    }
  });
}

// pindah Data Buku
function pindahBuku(idBuku, dibaca) {
  Swal.fire({
    title: "Konfirmasi Pindah",
    text: "Apakah Anda yakin memindahkan buku ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33ingin",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, pindah!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // ambil data buku dari local storage
      let dataBuku = JSON.parse(localStorage.getItem("buku"));

      // Temukan indeks buku yang akan diubah dalam array dataBuku
      let indexBukuUbah = dataBuku.findIndex((buku) => buku.id === idBuku);

      // Periksa apakah buku ditemukan
      if (indexBukuUbah !== -1) {
        // Ubah isComplete buku pada indeks yang ditentukan
        dataBuku[indexBukuUbah].isComplete = dibaca;

        // Simpan kembali array dataBuku yang telah diperbarui ke localStorage
        localStorage.setItem("buku", JSON.stringify(dataBuku));

        // Perbarui tampilan data pada Rak Buku
        tampilkanBuku();
        // console.log("Buku telah diubah dari localStorage");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Buku berhasil dipindah",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.log("Buku tidak ditemukan dalam localStorage");
      }
    }
  });
}

// Pencarian Buku
function cariBuku(event) {
  event.preventDefault(); // Mencegah perilaku bawaan formulir (submit) untuk direfresh
  const elemenForm = event.target; // mendapatkan elemen form

  // nilai input yang ingin dicari
  let inputCari = elemenForm.querySelector("#judul").value;

  if (inputCari) {
    // ambil data buku dari local storage
    let dataBuku = JSON.parse(localStorage.getItem("buku"));

    // Buat array untuk menyimpan buku yang dicari
    let bukuCari = [];

    // Iterasi melalui setiap buku dalam array dataBuku
    dataBuku.forEach(function (buku) {
      // Periksa apakah judul buku yang mengandung kata dari inputCari
      if (buku.judul.toLowerCase().includes(inputCari.toLowerCase())) {
        // Jika ya, tambahkan buku ke dalam array bukuCari
        bukuCari.push(buku);
      }
    });

    // Pastikan ada data buku yang tersimpan
    if (bukuCari) {
      // ambil template untuk tempat menyimpan seluruh bukunya
      let templateSudahDibaca = document.getElementById("templateSudahDibaca");
      let templateBelumDibaca = document.getElementById("templateBelumDibaca");

      // buat variabel daftar buku yang dicari untuk menampung sementara buku-bukunya
      let listBukuSudahDibaca = "";
      let listBukuBelumDibaca = "";

      // Loop melalui setiap buku dalam array bukuCari
      bukuCari.forEach(function (buku) {
        // Apakah bukunya sudah dibaca
        if (buku.isComplete) {
          // buat elemen untuk bukunya (judul, penulis, tahun)
          let bukuElemen = bukuElemenTemplate(buku, "Belum Selesai Dibaca", false);
          // tambahkan elemen buku ke dalam variabel daftar buku yang dicari
          listBukuSudahDibaca = listBukuSudahDibaca + bukuElemen;
        } else {
          // buat elemen untuk bukunya (judul, penulis, tahun)
          let bukuElemen = bukuElemenTemplate(buku, "Selesai Dibaca", true);
          // tambahkan elemen buku ke dalam variabel daftar buku yang dicari
          listBukuBelumDibaca = listBukuBelumDibaca + bukuElemen;
        }
      });
      // Mengganti/Memperbarui daftar buku yang dicari ke dalam elemen template
      templateSudahDibaca.innerHTML = listBukuSudahDibaca;
      templateBelumDibaca.innerHTML = listBukuBelumDibaca;
    }
  } else {
    // jika tidak ada yang dicari (nilainya kosong)
    tampilkanBuku();
  }

  // pindah tampilan ke raknya
  document.getElementById("rak").scrollIntoView();
}

// Tambahan Ketika Checkbox Dipencet pada Form Tambah Buku
function updateCheckbox(elemen) {
  // ambil elemen tombol submit
  let spanSubmit = document.getElementById("spanSubmit");

  // Periksa status kotak centang
  if (elemen.checked) {
    // Jika dicentang
    spanSubmit.textContent = "Selesai Dibaca";
  } else {
    // Jika tidak dicentang
    spanSubmit.textContent = "Belum Selesai Dibaca";
  }
}

// Edit Modal
function editModal(idBuku) {
  // ambil data buku dari local storage
  let dataBuku = JSON.parse(localStorage.getItem("buku"));

  // Temukan indeks buku yang akan diubah dalam array dataBuku
  let indexBukuUbah = dataBuku.findIndex((buku) => buku.id === idBuku);

  // Periksa apakah buku ditemukan
  if (indexBukuUbah !== -1) {
    // ambil elemen inputan di form edit modalnya
    let idBukuModal = document.getElementById("idBukuModal");
    let inputJudul = document.getElementById("judulModal");
    let inputPenulis = document.getElementById("penulisModal");
    let inputTahun = document.getElementById("tahunModal");
    let inputDibaca = document.getElementById("dibacaModal");

    // isikan valuenya pada elemen inputannya agar sesuai dengan data sebelumnya
    idBukuModal.value = dataBuku[indexBukuUbah].id;
    inputJudul.value = dataBuku[indexBukuUbah].judul;
    inputPenulis.value = dataBuku[indexBukuUbah].penulis;
    inputTahun.value = dataBuku[indexBukuUbah].tahun;
    inputDibaca.checked = dataBuku[indexBukuUbah].isComplete;
  } else {
    console.log("Buku tidak ditemukan dalam localStorage");
  }
}

// Edit Data Buku
function editBuku(event) {
  event.preventDefault(); // Mencegah perilaku bawaan formulir (submit) untuk direfresh
  const elemenForm = event.target; // mendapatkan elemen form

  // ambil data buku dari local storage
  let dataBuku = JSON.parse(localStorage.getItem("buku"));

  // ambil id bukunya dulu
  let idBuku = elemenForm.querySelector("#idBukuModal").value;
  idBuku = Number(idBuku); // ubah tipe data ke dalam number/integer dulu

  // Temukan indeks buku yang akan diubah dalam array dataBuku
  let indexBukuUbah = dataBuku.findIndex((buku) => buku.id === idBuku);

  // Periksa apakah buku ditemukan
  if (indexBukuUbah !== -1) {
    // nilai-nilai input
    let inputJudul = elemenForm.querySelector("#judulModal").value;
    let inputPenulis = elemenForm.querySelector("#penulisModal").value;
    let inputTahun = elemenForm.querySelector("#tahunModal").value;
    inputTahun = Number(inputTahun); // mengubah tahun menjadi integer
    let inputDibaca = elemenForm.querySelector("#dibacaModal").checked;

    // Ubah data buku pada indeks yang ditentukan
    dataBuku[indexBukuUbah].judul = inputJudul;
    dataBuku[indexBukuUbah].penulis = inputPenulis;
    dataBuku[indexBukuUbah].tahun = inputTahun;
    dataBuku[indexBukuUbah].isComplete = inputDibaca;

    // Simpan kembali array dataBuku yang telah diperbarui ke localStorage
    localStorage.setItem("buku", JSON.stringify(dataBuku));

    // Perbarui tampilan data pada Rak Buku
    tampilkanBuku();
    // console.log("Buku telah diubah dari localStorage");
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Buku berhasil diubah",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    console.log("Buku tidak ditemukan dalam localStorage");
  }
}
