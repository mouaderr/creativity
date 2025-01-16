// عرض الشرائح
let slideIndex = 0;
showSlides();

function showSlides() {
    const slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 10000); // تغيير الصورة كل 10 ثوانٍ
}

// التعامل مع أزرار "اشتر الآن"
const buyButtons = document.querySelectorAll('.buy-button');
buyButtons.forEach(button => {
    button.addEventListener('click', function () {
        const price = this.getAttribute('data-price'); // الحصول على السعر من الزر
        showPaymentOptions(price); // عرض خيارات الدفع
    });
});

function showPaymentOptions(price) {
    const paymentMethodsSection = document.getElementById('payment-methods');
    paymentMethodsSection.style.display = 'block'; // إظهار قسم الدفع

    // تفريغ زر PayPal القديم إن وجد
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = '';

    // تهيئة زر PayPal
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price // استخدام السعر
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                alert('تم الدفع بنجاح! شكراً لك، ' + details.payer.name.given_name);
            });
        },
        onError: function (err) {
            console.error('خطأ أثناء الدفع:', err);
            alert('حدث خطأ أثناء عملية الدفع. يرجى المحاولة مرة أخرى.');
        }
    }).render('#paypal-button-container'); // عرض الزر داخل الحاوية
}
// التحكم بصندوق "تواصل معنا"
const contactLink = document.querySelector('a[href="#contact"]');
const contactModal = document.getElementById('contact-modal');
const closeModal = document.querySelector('.modal .close');

// فتح الصندوق عند الضغط على "تواصل معنا"
contactLink.addEventListener('click', (e) => {
    e.preventDefault(); // منع الانتقال للرابط
    contactModal.style.display = 'block';
});

// إغلاق الصندوق عند الضغط على زر الإغلاق
closeModal.addEventListener('click', () => {
    contactModal.style.display = 'none';
});

// إغلاق الصندوق عند الضغط خارج المحتوى
window.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        contactModal.style.display = 'none';
    }
});
 // منع النقر بزر الماوس الأيمن
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        alert('النقر بزر الماوس الأيمن معطل على هذه الصفحة.');
    });

    // منع اختصارات لوحة المفاتيح
    document.addEventListener('keydown', (event) => {
        // تعطيل F12 وCtrl+Shift+I وCtrl+U
        if (
            event.key === 'F12' ||
            (event.ctrlKey && event.shiftKey && event.key === 'I') ||
            (event.ctrlKey && event.key === 'U')
        ) {
            event.preventDefault();
            alert('تم تعطيل هذا الاختصار.');
        }
    });
    document.querySelectorAll('.buy-button').forEach((button, index) => {
        button.addEventListener('click', (e) => {
            const downloadLink = document.querySelectorAll('.download-link')[index];
            const price = document.querySelectorAll('.price')[index].getAttribute('data-price');
    
            paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: price
                            }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        // عرض رسالة تأكيد الشراء
                        alert(`تمت عملية الشراء بنجاح بواسطة ${details.payer.name.given_name}`);
    
                        // توجيه إلى خادم لتحضير رابط التنزيل
                        fetch(`/verify-payment?orderId=${details.id}&productIndex=${index}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    downloadLink.href = data.downloadUrl; // تعيين رابط التنزيل من الخادم
                                    downloadLink.style.display = 'inline'; // إظهار رابط التنزيل
                                } else {
                                    alert('حدث خطأ أثناء التحقق من الدفع. الرجاء المحاولة مرة أخرى.');
                                }
                            });
                    });
                }
            }).render(button.parentElement);
        });
    });
    