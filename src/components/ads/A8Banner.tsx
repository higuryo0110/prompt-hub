/* eslint-disable @next/next/no-img-element */

type A8BannerProps = {
  size?: 'small' | 'small2' | 'medium' | 'wide' | 'rect' | 'rect2' | 'rect-both' | 'leaderboard' | 'leaderboard2'
  className?: string
}

export default function A8Banner({ size = 'small', className = '' }: A8BannerProps) {
  // 728x90 リーダーボード
  if (size === 'leaderboard') {
    return (
      <div className={`w-full overflow-x-auto text-center ${className}`}>
        <a
          href="https://px.a8.net/svt/ejp?a8mat=4B3MEV+6FLN3M+ONS+TVBF5"
          rel="nofollow noopener noreferrer"
          target="_blank"
        >
          <img
            style={{ border: 0, maxWidth: '100%', height: 'auto' }}
            width={728}
            height={90}
            alt=""
            src="https://www26.a8.net/svt/bgt?aid=260509495389&wid=001&eno=01&mid=s00000003196005017000&mc=1"
          />
        </a>
        <img style={{ border: 0 }} width={1} height={1} src="https://www18.a8.net/0.gif?a8mat=4B3MEV+6FLN3M+ONS+TVBF5" alt="" />
      </div>
    )
  }

  // 728x90 リーダーボード（2枚目）
  if (size === 'leaderboard2') {
    return (
      <div className={`w-full overflow-x-auto text-center ${className}`}>
        <a
          href="https://px.a8.net/svt/ejp?a8mat=4B3MEV+6FLN3M+ONS+TV3PD"
          rel="nofollow noopener noreferrer"
          target="_blank"
        >
          <img
            style={{ border: 0, maxWidth: '100%', height: 'auto' }}
            width={728}
            height={90}
            alt=""
            src="https://www22.a8.net/svt/bgt?aid=260509495389&wid=001&eno=01&mid=s00000003196005016000&mc=1"
          />
        </a>
        <img style={{ border: 0 }} width={1} height={1} src="https://www15.a8.net/0.gif?a8mat=4B3MEV+6FLN3M+ONS+TV3PD" alt="" />
      </div>
    )
  }

  // 300x250 レクタングル（1枚目）
  if (size === 'rect') {
    return (
      <div className={`inline-block w-full max-w-[300px] ${className}`}>
        <a
          href="https://px.a8.net/svt/ejp?a8mat=4B3MEU+CC5E2A+5QLS+HW2Q9"
          rel="nofollow noopener noreferrer"
          target="_blank"
        >
          <img
            style={{ border: 0, maxWidth: '100%', height: 'auto' }}
            width={300}
            height={250}
            alt=""
            src="https://www21.a8.net/svt/bgt?aid=260509494746&wid=001&eno=01&mid=s00000026776003005000&mc=1"
          />
        </a>
        <img style={{ border: 0 }} width={1} height={1} src="https://www14.a8.net/0.gif?a8mat=4B3MEU+CC5E2A+5QLS+HW2Q9" alt="" />
      </div>
    )
  }

  // 300x250 レクタングル（2枚目）
  if (size === 'rect2') {
    return (
      <div className={`inline-block w-full max-w-[300px] ${className}`}>
        <a
          href="https://px.a8.net/svt/ejp?a8mat=4B3MEV+3B2PRM+5VDQ+BXB8X"
          rel="nofollow noopener noreferrer"
          target="_blank"
        >
          <img
            style={{ border: 0, maxWidth: '100%', height: 'auto' }}
            width={300}
            height={250}
            alt=""
            src="https://www26.a8.net/svt/bgt?aid=260509495200&wid=001&eno=01&mid=s00000027395002003000&mc=1"
          />
        </a>
        <img style={{ border: 0 }} width={1} height={1} src="https://www12.a8.net/0.gif?a8mat=4B3MEV+3B2PRM+5VDQ+BXB8X" alt="" />
      </div>
    )
  }

  // 300x250 2枚横並び
  if (size === 'rect-both') {
    return (
      <div className={`flex flex-wrap gap-4 justify-center ${className}`}>
        <A8Banner size="rect" />
        <A8Banner size="rect2" />
      </div>
    )
  }

  // 100x60 小バナー（2枚目）
  if (size === 'small2') {
    return (
      <div className={`inline-block ${className}`}>
        <a
          href="https://px.a8.net/svt/ejp?a8mat=4B3MEV+3B2PRM+5VDQ+BYDTT"
          rel="nofollow noopener noreferrer"
          target="_blank"
        >
          <img
            style={{ border: 0 }}
            width={100}
            height={60}
            alt=""
            src="https://www26.a8.net/svt/bgt?aid=260509495200&wid=001&eno=01&mid=s00000027395002008000&mc=1"
          />
        </a>
        <img style={{ border: 0 }} width={1} height={1} src="https://www14.a8.net/0.gif?a8mat=4B3MEV+3B2PRM+5VDQ+BYDTT" alt="" />
      </div>
    )
  }

  if (size === 'wide') {
    return (
      <div className={`flex flex-wrap gap-4 items-center justify-center ${className}`}>
        <A8SmallUnit />
        <A8SmallUnit />
        <A8SmallUnit />
      </div>
    )
  }

  if (size === 'medium') {
    return (
      <div className={`flex gap-3 items-center ${className}`}>
        <A8SmallUnit />
        <A8SmallUnit />
      </div>
    )
  }

  return (
    <div className={className}>
      <A8SmallUnit />
    </div>
  )
}

function A8SmallUnit() {
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
      <img style={{ border: 0 }} width={1} height={1} src="https://www13.a8.net/0.gif?a8mat=4B3MES+ARL7LE+50+2HC3BL" alt="" />
    </div>
  )
}
