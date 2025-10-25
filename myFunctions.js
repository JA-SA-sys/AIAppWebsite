
function validateAppName(name) {
    const pattern = /^[A-Za-z]+$/;
    return pattern.test(name);
}

function validateManufacturer(manufacturer) {
    const pattern = /^[A-Za-z0-9\s]+$/;
    return pattern.test(manufacturer) && manufacturer.trim().length > 0;
}

function validateUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (e) {
        return false;
    }
}

function showError(input, message) {
    const formGroup = $(input).closest('.form-group');
    const errorElement = formGroup.find('.error-message');
    
    $(input).addClass('invalid').removeClass('valid');
    errorElement.text(message).show();
}

function clearError(input) {
    const formGroup = $(input).closest('.form-group');
    const errorElement = formGroup.find('.error-message');
    
    $(input).removeClass('invalid').addClass('valid');
    errorElement.text('').hide();
}


$(document).ready(function() {
    
    if ($('#add-app-form').length > 0) {
        
        $('#appName').on('input', function() {
            const value = $(this).val();
            if (value.length === 0) {
                clearError(this);
            } else if (!validateAppName(value)) {
                showError(this, 'يجب أن يحتوي على أحرف إنجليزية فقط بدون فراغات أو أرقام');
            } else {
                clearError(this);
            }
        });
        
        $('#manufacturer').on('input', function() {
            const value = $(this).val();
            if (value.length === 0) {
                clearError(this);
            } else if (!validateManufacturer(value)) {
                showError(this, 'يجب أن يحتوي على أحرف إنجليزية وأرقام فقط');
            } else {
                clearError(this);
            }
        });
        
        $('#websiteUrl').on('input', function() {
            const value = $(this).val();
            if (value.length === 0) {
                clearError(this);
            } else if (!validateUrl(value)) {
                showError(this, 'يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://');
            } else {
                clearError(this);
            }
        });
        
        $('#isFree, #fieldOfUse').on('change', function() {
            const value = $(this).val();
            if (value === '') {
                showError(this, 'يجب اختيار قيمة من القائمة');
            } else {
                clearError(this);
            }
        });
        
        $('#add-app-form').on('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            const appName = $('#appName').val().trim();
            if (appName === '') {
                showError('#appName', 'هذا الحقل مطلوب');
                isValid = false;
            } else if (!validateAppName(appName)) {
                showError('#appName', 'يجب أن يحتوي على أحرف إنجليزية فقط بدون فراغات أو أرقام');
                isValid = false;
            } else {
                clearError('#appName');
            }
            
            const manufacturer = $('#manufacturer').val().trim();
            if (manufacturer === '') {
                showError('#manufacturer', 'هذا الحقل مطلوب');
                isValid = false;
            } else if (!validateManufacturer(manufacturer)) {
                showError('#manufacturer', 'يجب أن يحتوي على أحرف إنجليزية وأرقام فقط');
                isValid = false;
            } else {
                clearError('#manufacturer');
            }
            
            const websiteUrl = $('#websiteUrl').val().trim();
            if (websiteUrl === '') {
                showError('#websiteUrl', 'هذا الحقل مطلوب');
                isValid = false;
            } else if (!validateUrl(websiteUrl)) {
                showError('#websiteUrl', 'يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://');
                isValid = false;
            } else {
                clearError('#websiteUrl');
            }
            
            const isFree = $('#isFree').val();
            if (isFree === '') {
                showError('#isFree', 'يجب اختيار قيمة من القائمة');
                isValid = false;
            } else {
                clearError('#isFree');
            }
            
            const fieldOfUse = $('#fieldOfUse').val();
            if (fieldOfUse === '') {
                showError('#fieldOfUse', 'يجب اختيار قيمة من القائمة');
                isValid = false;
            } else {
                clearError('#fieldOfUse');
            }
            
            if (isValid) {
                const appData = {
                    name: appName,
                    manufacturer: manufacturer,
                    website: websiteUrl,
                    isFree: isFree,
                    field: fieldOfUse,
                    description: $('#appDescription').val().trim()
                };
                
           
                if (typeof(Storage) !== "undefined") {
                    const existingApps = JSON.parse(sessionStorage.getItem('newApps') || '[]');
                    existingApps.push(appData);
                    sessionStorage.setItem('newApps', JSON.stringify(existingApps));
                }
                
                alert('تم إضافة التطبيق بنجاح! سيتم الانتقال إلى صفحة التطبيقات.');
                
                window.location.href = 'apps.html';
            } else {
                $('html, body').animate({
                    scrollTop: $('.invalid').first().offset().top - 100
                }, 500);
            }
        });
        
        $('#add-app-form').on('reset', function() {
            setTimeout(function() {
                $('.error-message').text('').hide();
                $('input, select, textarea').removeClass('invalid valid');
            }, 10);
        });
    }
    
});


$(document).ready(function() {
   
    $('.details-row').hide();

    $('#apps-list').on('click', '.btn-details', function() {
        const targetId = $(this).data('target');
        const detailsRow = $('#' + targetId);

        detailsRow.slideToggle(400);

        if ($(this).text() === 'عرض التفاصيل') {
            $(this).text('إخفاء التفاصيل');
        } else {
            $(this).text('عرض التفاصيل');
        }
    });
    
    if ($('#apps-list').length > 0) {
        loadNewApps();
    }
});


function loadNewApps() {
    if (typeof(Storage) !== "undefined") {
        const newApps = JSON.parse(sessionStorage.getItem('newApps') || '[]');
        const tbody = $('#apps-list');
        
        newApps.forEach(function(app, index) {
            const newIndex = 'new-' + index;
            const row = `
                <tr>
                    <td>${app.name}</td>
                    <td>${app.manufacturer}</td>
                    <td>${app.field}</td>
                    <td>
                         <select>
                            <option value="${app.isFree}">${app.isFree === 'free' ? 'مجاني' : 'غير مجاني'}</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn-details" data-target="details-${newIndex}">عرض التفاصيل</button>
                    </td>
                </tr>
                <tr class="details-row" id="details-${newIndex}" style="display: none;">
                    <td colspan="5">
                        <div class="app-details">
                            <p><strong>الموقع الإلكتروني:</strong> <a href="${app.website}" target="_blank">${app.website}</a></p>
                            <p><strong>الوصف:</strong> ${app.description || 'لا يوجد وصف'}</p>
                        </div>
                    </td>
                </tr>
            `;
            tbody.append(row); 
        });
    }
}