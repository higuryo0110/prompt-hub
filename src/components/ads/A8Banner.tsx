/* eslint-disable @next/next/no-img-element */

type A8BannerProps = {
  size?: 'small' | 'medium' | 'wide'
  className?: string
}

export default function A8Banner({ size = 'small', className = '' }: A8BannerProps) {
  if (size === 'wide') {
    return (
      <div className={`flex flex-wrap gap-4 items-center justify-center ${className}`}>
        <A8BannerUnit />
        <A8BannerUnit />
        <A8BannerUnit />
      </div>
    )
  }

  if (size === 'medium') {
    return (
      <div className={`flex gap-3 items-center ${className}`}>
        <A8BannerUnit />
        <A8BannerUnit />
      </div>
    )
  }

  return (
    <div className={className}>
      <A8BannerUnit />
    </div>
  )
}

function A8BannerUnit() {
  return (
    <div className="inline-block">
      <a
        href="https://px.a8.net/svt/ejp?a8mat=4B3MES+ARL7LE+50+2HC3BL"
        rel="nofollow noopener noreferrer"
        target="_blank"
      >
        <img
          style={{ border: 0 }}
          width={120}
          height={60}
          alt=""
          src="https://www25.a8.net/svt/bgt?aid=260509492651&wid=001&eno=01&mid=s00000000018015005000&mc=1"
        />
      </a>
      <img
        style={{ border: 0 }}
        width={1}
        height={1}
        src="https://www13.a8.net/0.gif?a8mat=4B3MES+ARL7LE+50+2HC3BL"
        alt=""
      />
    </div>
  )
}
