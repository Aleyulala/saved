# Saved UI Implementation Report

## Durum

Bu rapor, `Aleyulala/saved` projesindeki istekleri ve mevcut uygulama durumunu açıklar.

## İstenen özellikler

- Üst bardaki sağ ikonların dikey olarak ortalanması.
- Arama kutusunun başlangıçta gizlenmesi.
- Üst barın en sağında arama butonu bulunması.
- Arama açıldığında Blogger mobil görünümüne benzer bulanık overlay ve üstte modal arama kutusu.
- Google, GitHub ve Google Items arama seçeneklerinin düzenlenmesi.
- Google Items adresi:

```text
https://www.google.com/preferences/source?q=
```

- PNG/JPEG yanında GIF, MP4 ve WebM arka plan desteği.
- Seçilen medya dosyasının IndexedDB içinde Blob olarak saklanması.
- Kaynak dosya bilgisayardan silinse bile tarayıcıdaki kayıt üzerinden arka planın yeniden yüklenmesi.
- MP4/WebM için `autoplay`, `muted`, `loop` ve `playsinline` kullanılması.

## Mevcut dosyalar

- `index.html`: Ana Saved uygulaması.
- `privacy.html`: Gizlilik sayfası.
- `site-config.js`: Başlangıç bağlantıları ve site ayarları.
- `ui-enhancements.css`: Yardımcı UI stilleri.
- `ui-enhancements.js`: Yardımcı arama ve medya mantığı.
- `ui-complete.css`: Genişletilmiş UI stilleri.
- `theme-560859626649677709.xml`: Blogger Plus UI mobil görünüm referansı.

## Önemli teknik not

Yardımcı CSS ve JavaScript dosyalarının etkili olması için `index.html` içine eklenmesi gerekir. `</head>` kapanışından hemen önce:

```html
<link rel="stylesheet" href="ui-complete.css">
```

`</body>` kapanışından hemen önce:

```html
<script src="ui-enhancements.js"></script>
```

Dosyalar yalnızca repoda bulunuyor fakat HTML tarafından yüklenmiyorsa tarayıcıda hiçbir görsel değişiklik görünmez. Bu nedenle tarayıcı önbelleğini temizlemek veya zorla yenilemek de gerekebilir:

- Windows/Linux: `Ctrl + Shift + R`
- macOS: `Cmd + Shift + R`

## IndexedDB medya davranışı

Tarayıcı, seçilen dosyayı IndexedDB içinde Blob olarak saklayabilir. Bu kayıt dosyanın bilgisayardaki orijinal konumundan bağımsızdır. GIF, Blob URL üzerinden animasyonunu korur; MP4/WebM ise video elementiyle hareketli oynatılabilir.

Tarayıcı depolama alanı kullanıcı tarafından temizlenirse veya site verileri silinirse bu kayıt da silinir. Bu nedenle IndexedDB, kalıcı garanti değil; tarayıcının site verileri korunabildiği sürece kalıcı yerel depolamadır.

## Uygulama kontrol listesi

- [ ] `ui-complete.css` `index.html` tarafından yükleniyor.
- [ ] `ui-enhancements.js` `index.html` tarafından yükleniyor.
- [ ] Arama butonu header sağındaki son eleman olarak ekleniyor.
- [ ] Arama modalı açılıp kapanıyor.
- [ ] ESC ve overlay tıklaması modalı kapatıyor.
- [ ] Google Items seçeneği mevcut.
- [ ] GitHub seçeneği Google'ın hemen altında.
- [ ] Sağ header ikonları dikey ortalanıyor.
- [ ] GIF arka plan animasyonu korunuyor.
- [ ] MP4/WebM arka plan sessiz, döngülü ve otomatik oynuyor.
- [ ] Dosya kaydı IndexedDB'den yeniden yükleniyor.

## Not

Blogger XML dosyası referans alınarak hazırlanmıştır. Blogger temasındaki kodu doğrudan GitHub HTML uygulamasına kopyalamak yerine, aynı mobil davranışlar ve görünüm bağımsız CSS/JavaScript ile uygulanmalıdır.
