# AGENT.md - Saved Projesi Geliştirme ve Talimat Kılavuzu

Bu belge, **Saved** projesinde kullanıcının talep ettiği tüm özellikleri, karşılaşılan sorunları, teknik mimariyi ve gelecekteki geliştirmelerde referans alınacak kuralları detaylı bir şekilde içermektedir.

---

## 1. Referans ve Çalışma Dizinleri
- **Aktif Çalışma Dizini**: `/home/negronn/İndirilenler/saved-main/`
- **Temiz Yedek / Önceki Kod Referansı**: `/home/negronn/İndirilenler/2saved-main/`
- **Blogger Şablon Referansı**: `theme-560859626649677709.xml`
- **Hedef Dosyalar**: `index.html` ve `privacy.html`

---

## 2. Kullanıcı Talepleri ve Özellik Detayları

### A. Üst Bar (Header) Aydınlık & Karanlık Mod Birebirliği
1. **Sorun / Durum**: Karanlık modda üst bar ekranın köşelerine yapışmayıp ortada yüzen hap (floating pill / rounded) şeklinde dururken, aydınlık modda köşelere yayılarak tamamen düz ve uzun oluyordu.
2. **Kural**:
   - Hem karanlık hem de aydınlık modda üst bar (`.mainH` ve `.headC`) fiziksel olarak **aynı ölçü, kavis (border-radius: 18px), genişlik kısıtı (max-width: 1440px) ve ortalama kurallarına (margin: 0 auto)** sahip olmalıdır.
   - Aydınlık modda yalnızca renkler (yüzey rengi, kenarlık rengi) değişmeli; kapsayıcı genişliği ve konumu değişmemelidir.
   - `privacy.html` ve `index.html` dosyalarının her ikisine de uygulanmalıdır.

### B. Üst Menüdeki Context Menülerinin Hizalanması ve Boşluğu
1. **Sorun / Durum**: Sağ üst köşedeki Tema (`.thmW`), Görünüm (`.aprW`) ve Çeviri (`.wTrans`) menüleri açıldığında üst barın yuvarlatılmış köşelerine biniyordu.
2. **Kural**:
   - Açılan pencereler üst barın altında temiz bir boşlukla (`top: calc(100% + 8px);`) ve sağ kenardan içeri doğru (`inset-inline-end: 20px;`) hizalanmalıdır.
   - `privacy.html` dosyasındaki temiz hizalama yapısı baz alınmalıdır.

### C. Sağ Üst İkonların Dikey Ortalanması (Vertical Centering)
1. **Sorun**: `index.html` ve `privacy.html` dosyalarında sağ üst köşedeki ikonlar (Arama, Tema/Mod, Ayarlar, Düzenle, Çeviri) ortada durması gerekirken dikey eksende yukarıda veya kayık duruyordu.
2. **Kural & Çözüm**:
   - `.headC`, `.headD.headR`, `.headP`, `#sec_Header_Icon` ve `.headIc` katmanlarının tümü `height: 60px !important; display: flex !important; align-items: center !important; margin: 0 !important;` olmalıdır.
   - Blogger şablonundan miras kalan `.section { margin-bottom: 12px; }` gibi stillerin üst barı yukarı itmesi `margin: 0 !important` ile engellenmelidir.
   - `.headIc > li` elemanları `height: 60px !important; display: flex !important; align-items: center !important; justify-content: center !important;` ile dikeyde tam ortalanmalıdır.
   - `.tIc` butonları `width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center;` olmalı, içlerindeki SVG'ler `margin: auto; display: block;` ile ortalanmalıdır.

### D. Arama Kutusunun Gizlenmesi ve Blogger Mobil Tarzı Bulanık Arama Overlay'i
1. **Doğrudan Görünürlük**: Arama kutusu (`#searchForm`) ana sayfada/hero kısmında doğrudan görünmeyecektir.
2. **Arama Butonu Konumu**:
   - Üst barın sağındaki ikon listesinin (`.headIc`) **en sonuna (en sağa)** bir arama butonu (`#openSearchBtn` / `li.isSearch`) eklenecektir.
3. **Bulanık Overlay Davranışı**:
   - Arama butonuna tıklandığında ekran arkada `backdrop-filter: saturate(180%) blur(16px); background: rgba(0,0,0,0.45);` ile bulanıklaşacaktır.
   - `theme-560859626649677709.xml` Blogger şablonundaki mobil arama mantığı gibi, arama kutusu ekranın en üstünde (`top: 16px` / `padding-top: 16px`) şık bir animasyonla belirecektir.
   - Açıldığı anda arama girdisine otomatik odaklanılacaktır (`$('#search').focus()`).
   - Kapatma butonuna (`&times;`), bulanık arka plana tıklayarak veya klavyeden `Escape` tuşuna basarak kapatılabilmelidir.
4. **Kritik Tıklama Güvenliği (Pointer Events & Display)**:
   - Overlay kapalıyken kesinlikle `display: none !important; pointer-events: none !important;` olmalıdır. Aksi halde görünmez bir katman olarak sayfadaki diğer butonların veya "Your favorites" bağlantılarının tıklanmasını engeller.
5. **Arama Motorları Sıralaması**:
   - `select#engine` dropdown menüsünde sıralama şu şekilde olmalıdır:
     1. `Google` (`https://www.google.com/search?q=`)
     2. `GitHub` (`https://github.com/search?q=`)
     3. `Google Items` (`https://www.google.com/preferences/source?q=`)
     4. Diğer arama motorları sırasıyla gelmelidir.
   - Arama kutusu seçim kısmı (`select.engine`), context menüleriyle uyumlu modern hap görünümünde (`border-radius: 10px`, `background: var(--surface)`, `border: 1px solid var(--line)`) olmalıdır.

### E. Hareketli Arka Plan (GIF & MP4 Video) ve Kalıcı Tarayıcı Hafızası
1. **İhtiyaç**: Kullanıcı "Görsel Seç" alanından GIF veya MP4 video seçtiğinde arka planda hareketli/canlı bir şekilde oynamalıdır.
2. **Kalıcı Önbellekleme (IndexedDB)**:
   - Kullanıcı orijinal MP4 veya GIF dosyasını bilgisayarından ya da İndirilenler klasöründen silse bile, tarayıcı arka planı hafızasında tutmaya devam etmelidir.
   - Bu işlem **IndexedDB** (`backgroundStore`) üzerinde orijinal ikili veri (`Blob` / `File`) saklanarak gerçekleştirilir.
3. **Canvas Dönüştürme Tuzağı**:
   - Önceden statik resimler için uygulanan `<canvas>` sıkıştırması GIF'leri tek karelik durağan JPEG'e çevirdiği ve MP4 videoları bozduğu için; GIF ve Video dosyaları doğrudan `Blob` olarak IndexedDB'ye kaydedilmelidir.
4. **Oynatma Mantığı**:
   - Arka plan aktif ve seçilen dosya video ise `#bgLayer` içerisine otomatik oynatılan, sessiz, döngülü (`<video autoplay loop muted playsinline>`) bir video yerleştirilmelidir.
   - GIF ise `background-image: url(...)` olarak tam ekranda kesintisiz oynatılmalıdır.
   - "Görseli Kaldır" dendiğinde IndexedDB'den silinmeli, video elemanı kaldırılmalı ve bellekten URL revoke edilmelidir.

---

## 3. Yapılacaklar Kontrol Listesi (Checklist)

- [ ] `index.html` dosyasında `.search-overlay`'in kapalıyken `display: none !important` olduğundan ve sayfa etkileşimini (özellikle "Your favorites" ve kart tıklamalarını) engellemediğinden emin olun.
- [ ] Üst bar ikonlarının dikeyde tam merkezlendiğini (`height: 60px`, `align-items: center`, `margin: 0`) doğrulayın.
- [ ] Arama butonunun (`#openSearchBtn`) en sağda yer aldığını ve tıklandığında overlay'in sorunsuz açılıp arama girdisine odaklandığını test edin.
- [ ] `select#engine` listesinde `Google` -> `GitHub` -> `Google Items` sıralamasını kontrol edin.
- [ ] GIF ve MP4 yükleyerek arka planda hareketli oynatmayı ve sayfa yenilendiğinde IndexedDB'den sorunsuz yüklendiğini doğrulayın.
- [ ] Tüm bu kuralların `privacy.html` ile de tam uyumlu olduğunu kontrol edin.
