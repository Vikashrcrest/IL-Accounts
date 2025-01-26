#pragma once

#include "winrt/Microsoft.ReactNative.h"

namespace winrt::KhatavahiRojmelApp::implementation
{
    struct ReactPackageProvider : winrt::implements<ReactPackageProvider, winrt::Microsoft::ReactNative::IReactPackageProvider>
    {
    public: // IReactPackageProvider
        void CreatePackage(winrt::Microsoft::ReactNative::IReactPackageBuilder const &packageBuilder) noexcept;
    };
} // namespace winrt::KhatavahiRojmelApp::implementation

